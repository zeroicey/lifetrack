package storage

import (
	"context"
	"fmt"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
)

type Service struct {
	client *minio.Client
}

func NewService() (*Service, error) {
	client, err := minio.New(config.Storage.Endpoint, &minio.Options{
		Creds:        credentials.NewStaticV4(config.Storage.AccessKey, config.Storage.SecretKey, ""),
		BucketLookup: minio.BucketLookupDNS,
		Secure:       config.Storage.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client: %w", err)
	}

	service := &Service{client: client}

	// // 确保存储桶存在
	// if err := service.ensureBucketExists(context.Background()); err != nil {
	// 	return nil, fmt.Errorf("failed to ensure bucket exists: %w", err)
	// }

	return service, nil
}

func (s *Service) EnsureBucketExists(ctx context.Context, body types.CreateMomentBody) {
}
