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

func (s *Service) CreateUploadRequest(ctx context.Context, req *types.PresignedUploadRequest) (*types.PresignedUploadResponse, error) {
	existingAttachment, err := s.q.FindCompletedAttachmentByMD5(ctx, req.MD5)
	if err == nil && existingAttachment.ID.Valid {
		standardUUID := uuid.UUID(existingAttachment.ID.Bytes)
		s.logger.Info("Instant upload detected", zap.String("attachmentId", standardUUID.String()))

		params := repository.CreateAttachmentParams{
			ObjectKey:    existingAttachment.ObjectKey,
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

	expiry := time.Duration(config.Storage.PresignedExpiry) * time.Minute
	presignedURL, err := s.client.PresignedPutObject(ctx, config.Storage.BucketName, objectKey, expiry)
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
