package storage

import (
	"context"

	"github.com/gofiber/fiber/v2/log"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/zeroicey/lifetrack-api/internal/config"
)

func MustInitMinio(cfg config.StorageConfig) *minio.Client {
	minioClient, err := minio.New(cfg.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.AccessKey, cfg.SecretKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Panicf("failed to init minio: %v", err)
	}

	ctx := context.Background()
	exists, err := minioClient.BucketExists(ctx, cfg.BucketName)
	if err != nil {
		log.Panicf("failed to check bucket: %v", err)
	}
	if !exists {
		err = minioClient.MakeBucket(ctx, cfg.BucketName, minio.MakeBucketOptions{})
		if err != nil {
			log.Panicf("failed to create bucket: %v", err)
		}
	}

	log.Info("✅ connected to MinIO:", cfg.Endpoint)
	return minioClient
}
