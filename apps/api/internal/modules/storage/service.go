package storage

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
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
		objectKey := uuid.NewString() + ext

		attachment, err := qtx.CreateAttachment(ctx, repository.CreateAttachmentParams{
			ObjectKey:    objectKey,
			OriginalName: body.FileName,
			MimeType:     body.MimeType,
			Md5:          body.MD5,
			FileSize:     body.FileSize,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to create attachment record: %w", err)
		}

		expiry := time.Duration(s.config.Storage.PresignedExpiry) * time.Minute
		presignedURL, err := s.client.PresignedPutObject(ctx, s.config.Storage.BucketName, objectKey, expiry)
		if err != nil {
			return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
		}

		responses = append(responses, types.PresignedUploadResponse{
			AttachmentID: attachment.ID.String(),
			UploadURL:    presignedURL.String(),
			ObjectKey:    attachment.ObjectKey,
			IsDuplicate:  false,
		})
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, errors.New("failed to commit transaction")
	}

	return responses, nil
}

func (s *Service) CompleteUpload(ctx context.Context, attachmentID uuid.UUID) error {
	err := s.Q.UpdateAttachmentStatus(ctx, repository.UpdateAttachmentStatusParams{
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

	return nil
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
