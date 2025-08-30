package storage

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage/types"
	"github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type Service struct {
	Q      *repository.Queries
	DB     *pgxpool.Pool
	logger *zap.Logger
	client *minio.Client
	config *config.Config
}

func NewService(db *pgxpool.Pool, q *repository.Queries, client *minio.Client, logger *zap.Logger, config *config.Config) *Service {

	return &Service{
		DB:     db,
		Q:      q,
		client: client,
		logger: logger,
		config: config,
	}
}

func (s *Service) EnsureBucketExists(ctx context.Context) error {
	bucketName := s.config.Storage.BucketName
	exists, err := s.client.BucketExists(ctx, bucketName)
	if err != nil {
		return fmt.Errorf("failed to check if bucket exists: %w", err)
	}
	if !exists {
		err = s.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{Region: s.config.Storage.Region})
		if err != nil {
			return fmt.Errorf("failed to create bucket: %w", err)
		}
	}
	return nil
}

func (s *Service) CreateUploadRequest(ctx context.Context, bodies *[]types.PresignedUploadRequest) ([]types.PresignedUploadResponse, error) {
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := s.Q.WithTx(tx)

	responses := make([]types.PresignedUploadResponse, 0, len(*bodies))

	for _, body := range *bodies {
		// Check if attachment already exists
		existingAttachment, err := qtx.FindCompletedAttachmentByMD5(ctx, body.MD5)
		if err == nil && existingAttachment.ID.Valid {
			responses = append(responses, types.PresignedUploadResponse{
				AttachmentID: existingAttachment.ID.String(),
				ObjectKey:    existingAttachment.ObjectKey,
				IsDuplicate:  true,
			})
			continue
		}

		ext := filepath.Ext(body.FileName)
		objectKey := uuid.NewString()
		coverObjectKey := objectKey + "." + body.CoverExt
		objectKey = objectKey + ext

		attachment, err := qtx.CreateAttachment(ctx, repository.CreateAttachmentParams{
			ObjectKey:      objectKey,
			CoverObjectKey: coverObjectKey,
			OriginalName:   body.FileName,
			MimeType:       body.MimeType,
			Md5:            body.MD5,
			CoverMd5:       body.CoverMD5,
			FileSize:       body.FileSize,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create attachment record: %w", err)
		}

		expiry := time.Duration(s.config.Storage.PresignedExpiry) * time.Minute
		presignedURL, err := s.client.PresignedPutObject(ctx, s.config.Storage.BucketName, objectKey, expiry)
		if err != nil {
			return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
		}

		coverPresignedURL, err := s.client.PresignedPutObject(ctx, s.config.Storage.BucketName, coverObjectKey, expiry)
		if err != nil {
			return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
		}

		responses = append(responses, types.PresignedUploadResponse{
			AttachmentID:   attachment.ID.String(),
			UploadURL:      presignedURL.String(),
			CoverUploadUrl: coverPresignedURL.String(),
			ObjectKey:      attachment.ObjectKey,
			IsDuplicate:    false,
		})
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, errors.New("failed to commit transaction")
	}

	return responses, nil
}

func (s *Service) CompleteUpload(ctx context.Context, attachmentID uuid.UUID) error {
	// 首先获取数据库中的attachment记录
	attachment, err := s.Q.GetAttachmentById(ctx, pkg.UUIDToPgUUID(attachmentID))
	if err != nil {
		s.logger.Error("Failed to get attachment from DB",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return fmt.Errorf("could not get attachment for ID %s: %w", attachmentID.String(), err)
	}

	// 验证主文件的MD5
	fileMD5, err := s.getObjectETag(ctx, attachment.ObjectKey)
	if err != nil {
		s.logger.Error("Failed to get file ETag from MinIO",
			zap.String("attachmentId", attachmentID.String()),
			zap.String("objectKey", attachment.ObjectKey),
			zap.Error(err),
		)
		return fmt.Errorf("could not get file ETag for attachment %s: %w", attachmentID.String(), err)
	}

	if fileMD5 != attachment.Md5 {
		s.logger.Error("File MD5 mismatch",
			zap.String("attachmentId", attachmentID.String()),
			zap.String("expectedMD5", attachment.Md5),
			zap.String("actualMD5", fileMD5),
		)
		return fmt.Errorf("file MD5 mismatch for attachment %s: expected %s, got %s", attachmentID.String(), attachment.Md5, fileMD5)
	}

	// 验证封面文件的MD5
	coverMD5, err := s.getObjectETag(ctx, attachment.CoverObjectKey)
	if err != nil {
		s.logger.Error("Failed to get cover ETag from MinIO",
			zap.String("attachmentId", attachmentID.String()),
			zap.String("coverObjectKey", attachment.CoverObjectKey),
			zap.Error(err),
		)
		return fmt.Errorf("could not get cover ETag for attachment %s: %w", attachmentID.String(), err)
	}

	if coverMD5 != attachment.CoverMd5 {
		s.logger.Error("Cover MD5 mismatch",
			zap.String("attachmentId", attachmentID.String()),
			zap.String("expectedCoverMD5", attachment.CoverMd5),
			zap.String("actualCoverMD5", coverMD5),
		)
		return fmt.Errorf("cover MD5 mismatch for attachment %s: expected %s, got %s", attachmentID.String(), attachment.CoverMd5, coverMD5)
	}

	// MD5验证通过，更新状态为completed
	err = s.Q.UpdateAttachmentStatus(ctx, repository.UpdateAttachmentStatusParams{
		ID:     pkg.UUIDToPgUUID(attachmentID),
		Status: "completed",
	})
	if err != nil {
		s.logger.Error("Failed to mark attachment as completed in DB",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return fmt.Errorf("could not update attachment status for ID %s: %w", attachmentID.String(), err)
	}

	s.logger.Info("Upload completed successfully",
		zap.String("attachmentId", attachmentID.String()),
		zap.String("objectKey", attachment.ObjectKey),
		zap.String("coverObjectKey", attachment.CoverObjectKey),
	)

	return nil
}

// getObjectETag 从MinIO获取对象的ETag（通常是MD5哈希值）
func (s *Service) getObjectETag(ctx context.Context, objectKey string) (string, error) {
	// 使用StatObject获取对象信息，包括ETag
	objectInfo, err := s.client.StatObject(ctx, s.config.Storage.BucketName, objectKey, minio.StatObjectOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to get object info from MinIO: %w", err)
	}

	// 移除ETag中的引号（如果存在）
	etag := strings.Trim(objectInfo.ETag, `"`)

	return etag, nil
}

func (s *Service) GeneratePresignedGetURL(ctx context.Context, attachmentID uuid.UUID) (string, error) {
	objectKey, err := s.Q.GetCompletedAttachmentObjectKey(ctx, pkg.UUIDToPgUUID(attachmentID))
	if err != nil {
		s.logger.Warn("Failed to get completed attachment object key",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return "", fmt.Errorf("attachment not found or not completed")
	}

	expiry := time.Duration(s.config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedGetObject(ctx, s.config.Storage.BucketName, objectKey, expiry, nil)
	if err != nil {
		s.logger.Error("Failed to generate presigned GET URL",
			zap.String("objectKey", objectKey),
			zap.Error(err),
		)
		return "", fmt.Errorf("could not generate access URL")
	}
	return presignedURL.String(), nil
}

func (s *Service) GeneratePresignedGetCoverURL(ctx context.Context, attachmentID uuid.UUID) (string, error) {
	objectKey, err := s.Q.GetCompletedAttachmentCoverObjectKey(ctx, pkg.UUIDToPgUUID(attachmentID))
	if err != nil {
		s.logger.Warn("Failed to get completed attachment object key",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return "", fmt.Errorf("attachment not found or not completed")
	}

	expiry := time.Duration(s.config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedGetObject(ctx, s.config.Storage.BucketName, objectKey, expiry, nil)
	if err != nil {
		s.logger.Error("Failed to generate presigned GET Cover URL",
			zap.String("objectKey", objectKey),
			zap.Error(err),
		)
		return "", fmt.Errorf("could not generate access cover URL")
	}
	return presignedURL.String(), nil
}
