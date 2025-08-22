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
	config *config.Config
}

func NewService(q *repository.Queries, client *minio.Client, logger *zap.Logger, config *config.Config) *Service {

	return &Service{
		q:      q,
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

func (s *Service) CreateUploadRequest(ctx context.Context, req *types.PresignedUploadRequest) (*types.PresignedUploadResponse, error) {
	existingAttachment, err := s.q.FindCompletedAttachmentByMD5(ctx, req.MD5)
	if err == nil && existingAttachment.ID.Valid {
		s.logger.Sugar().Logf(zap.InfoLevel, "Found existing attachment with name %s", existingAttachment.OriginalName)
		standardUUID := uuid.UUID(existingAttachment.ID.Bytes)
		s.logger.Info("Instant upload detected", zap.String("attachmentId", standardUUID.String()))

		return &types.PresignedUploadResponse{
			AttachmentID: existingAttachment.ID.String(),
			UploadURL:    "",
			ObjectKey:    existingAttachment.ObjectKey,
			IsDuplicate:  true,
		}, nil
	}

	ext := filepath.Ext(req.FileName)
	objectKey := uuid.NewString() + ext

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

	expiry := time.Duration(s.config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedPutObject(ctx, s.config.Storage.BucketName, objectKey, expiry)
	if err != nil {
		s.logger.Error("Failed to generate presigned URL", zap.Error(err))
		return nil, fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return &types.PresignedUploadResponse{
		AttachmentID: attachment.ID.String(),
		UploadURL:    presignedURL.String(),
		ObjectKey:    attachment.ObjectKey,
		IsDuplicate:  false,
	}, nil
}

func (s *Service) CompleteUpload(ctx context.Context, attachmentID uuid.UUID) error {
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
	objectKey, err := s.q.GetCompletedAttachmentObjectKey(ctx, pgtype.UUID{Bytes: attachmentID, Valid: true})
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
