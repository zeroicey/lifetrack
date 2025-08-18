// internal/modules/storage/service.go

package storage

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type Service struct {
	q      *repository.Queries
	logger *zap.Logger
	client *minio.Client
}

func NewService(q *repository.Queries, client *minio.Client, logger *zap.Logger) *Service {
	return &Service{
		q:      q,
		client: client,
		logger: logger,
	}
}

// EnsureBucketExists 应该在应用启动时调用一次，而不是在每个请求中
func (s *Service) EnsureBucketExists(ctx context.Context) {
	bucketName := config.Storage.BucketName
	exists, err := s.client.BucketExists(ctx, bucketName)
	if err != nil {
		s.logger.Fatal("Failed to check if bucket exists", zap.Error(err))
	}
	if !exists {
		err = s.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{Region: config.Storage.Region})
		if err != nil {
			s.logger.Fatal("Failed to create bucket", zap.String("bucket", bucketName), zap.Error(err))
		}
		s.logger.Info("Successfully created bucket", zap.String("bucket", bucketName))
	}
}

// CreateUploadRequest 负责处理上传请求的核心逻辑
func (s *Service) CreateUploadRequest(ctx context.Context, req *types.PresignedUploadRequest) (*types.PresignedUploadResponse, error) {
	existingAttachment, err := s.q.FindCompletedAttachmentByMD5(ctx, req.MD5)
	if err == nil && existingAttachment.ID.Valid {
		// 找到了！existingAttachment.ID.Valid 为 true 意味着数据库返回了一个非NULL的值。
		// 这比检查 uuid.Nil 更能准确反映数据库的真实状态。
		// 如何获取标准的 uuid.UUID 值？
		// 就用 .Bytes 字段!
		standardUUID := uuid.UUID(existingAttachment.ID.Bytes)
		s.logger.Info("Instant upload detected", zap.String("attachmentId", standardUUID.String()))

		// 虽然文件已存在于MinIO，但我们仍需为这次新的“使用”创建一个新的数据库记录，
		// 这样才能把它关联到新的动态(moment)上。它会指向同一个ObjectKey。
		// 这是一种设计选择，另一种是直接复用旧的attachmentID。创建新的更清晰。
		params := repository.CreateAttachmentParams{
			ObjectKey:    existingAttachment.ObjectKey, // 复用已存在的ObjectKey!
			OriginalName: req.FileName,
			MimeType:     req.ContentType,
			Md5:          req.MD5,
			FileSize:     req.FileSize,
		}
		newAttachment, err := s.q.CreateAttachment(ctx, params)
		if err != nil {
			s.logger.Error("Failed to create attachment record for instant upload", zap.Error(err))
			return nil, fmt.Errorf("failed to create attachment record: %w", err)
		}

		return &types.PresignedUploadResponse{
			AttachmentID: newAttachment.ID.String(),
			UploadURL:    "",
			ObjectKey:    newAttachment.ObjectKey,
			IsDuplicate:  true,
		}, nil
	}

	ext := filepath.Ext(req.FileName)
	objectKey := uuid.NewString() + ext

	// 3. 在数据库中创建附件记录，状态为 'uploading'
	dbParams := repository.CreateAttachmentParams{
		ObjectKey:    objectKey,
		OriginalName: req.FileName,
		MimeType:     req.ContentType,
		Md5:          req.MD5,
		FileSize:     req.FileSize,
	}
	attachment, err := s.q.CreateAttachment(ctx, dbParams)
	if err != nil {
		s.logger.Error("Failed to create attachment in DB", zap.Error(err))
		return nil, fmt.Errorf("failed to create attachment record: %w", err)
	}

	// 4. 生成预签名URL，让客户端上传到我们指定的ObjectKey
	expiry := time.Duration(config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedPutObject(ctx, config.Storage.BucketName, objectKey, expiry)
	if err != nil {
		s.logger.Error("Failed to generate presigned URL", zap.Error(err))
		// 理论上这里应该把刚才创建的数据库记录状态更新为 'failed'
		return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	// 5. 返回成功响应
	return &types.PresignedUploadResponse{
		AttachmentID: attachment.ID.String(),
		UploadURL:    presignedURL.String(),
		ObjectKey:    attachment.ObjectKey,
		IsDuplicate:  false,
	}, nil
}

// CompleteUpload 标记一个附件为上传完成
func (s *Service) CompleteUpload(ctx context.Context, attachmentID uuid.UUID) error {
	// 调用由sqlc生成的数据库方法
	// 这里我们假设 attachmentID 已经是经过验证的 UUID
	err := s.q.UpdateAttachmentStatus(ctx, repository.UpdateAttachmentStatusParams{
		ID:     pgtype.UUID{Bytes: attachmentID, Valid: true},
		Status: "completed",
	})
	if err != nil {
		s.logger.Error("Failed to mark attachment as completed in DB",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return fmt.Errorf("could not update attachment status for ID %s: %w", attachmentID.String(), err)
	}

	s.logger.Info("Successfully marked attachment as completed", zap.String("attachmentId", attachmentID.String()))
	return nil
}

func (s *Service) GeneratePresignedGetURL(ctx context.Context, attachmentID uuid.UUID) (string, error) {
	// 1. 调用新的数据库方法，它内部已经包含了 status = 'completed' 的检查
	objectKey, err := s.q.GetCompletedAttachmentObjectKey(ctx, pgtype.UUID{Bytes: attachmentID, Valid: true})
	if err != nil {
		s.logger.Warn("Failed to get completed attachment object key",
			zap.String("attachmentId", attachmentID.String()),
			zap.Error(err),
		)
		return "", fmt.Errorf("attachment not found or not completed")
	}

	// 2. 后续生成URL的逻辑完全不变
	expiry := time.Duration(config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedGetObject(ctx, config.Storage.BucketName, objectKey, expiry, nil)
	if err != nil {
		s.logger.Error("Failed to generate presigned GET URL",
			zap.String("objectKey", objectKey),
			zap.Error(err),
		)
		return "", fmt.Errorf("could not generate access URL")
	}
	return presignedURL.String(), nil
}
