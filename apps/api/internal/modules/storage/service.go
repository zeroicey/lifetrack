package storage

import (
	"context"
	"errors"
	"fmt"
	"net/url"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage/types"
)

type Service struct {
	client *minio.Client
}

func NewService() (*Service, error) {
	// 创建 MinIO 客户端
	client, err := minio.New(config.Storage.Endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(config.Storage.AccessKey, config.Storage.SecretKey, ""),
		Secure: config.Storage.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create minio client: %w", err)
	}

	service := &Service{client: client}

	// 确保存储桶存在
	if err := service.ensureBucketExists(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to ensure bucket exists: %w", err)
	}

	return service, nil
}

// 确保存储桶存在
func (s *Service) ensureBucketExists(ctx context.Context) error {
	bucketName := config.Storage.BucketName

	exists, err := s.client.BucketExists(ctx, bucketName)
	if err != nil {
		return err
	}

	if !exists {
		return s.client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{
			Region: config.Storage.Region,
		})
	}

	return nil
}

// 生成预签名上传URL
func (s *Service) GeneratePresignedUploadURL(ctx context.Context, fileName, contentType string, userID ...string) (*types.PresignedUploadResponse, error) {
	// 验证文件类型
	if contentType != "" && !types.IsValidFileType(contentType) {
		return nil, errors.New("unsupported file type")
	}

	// 生成对象键
	objectKey := types.GenerateObjectKey(fileName, userID...)

	// 生成预签名上传URL
	presignedURL, err := s.client.PresignedPutObject(
		ctx,
		config.Storage.BucketName,
		objectKey,
		time.Duration(config.Storage.PresignedExpiry)*time.Second,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate presigned upload URL: %w", err)
	}

	return &types.PresignedUploadResponse{
		UploadURL: presignedURL.String(),
		ObjectKey: objectKey,
		ExpiresIn: config.Storage.PresignedExpiry,
	}, nil
}

// 生成预签名下载URL
func (s *Service) GeneratePresignedDownloadURL(ctx context.Context, objectKey string) (*types.PresignedDownloadResponse, error) {
	// 检查对象是否存在
	_, err := s.client.StatObject(ctx, config.Storage.BucketName, objectKey, minio.StatObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("object not found: %w", err)
	}

	// 生成预签名下载URL
	presignedURL, err := s.client.PresignedGetObject(
		ctx,
		config.Storage.BucketName,
		objectKey,
		time.Duration(config.Storage.PresignedExpiry)*time.Second,
		url.Values{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate presigned download URL: %w", err)
	}

	return &types.PresignedDownloadResponse{
		DownloadURL: presignedURL.String(),
		ExpiresIn:   config.Storage.PresignedExpiry,
	}, nil
}

// 删除文件
func (s *Service) DeleteFile(ctx context.Context, objectKey string) error {
	err := s.client.RemoveObject(ctx, config.Storage.BucketName, objectKey, minio.RemoveObjectOptions{})
	if err != nil {
		return fmt.Errorf("failed to delete object: %w", err)
	}
	return nil
}

// 获取临时访问URL（用于前端直接访问）
func (s *Service) GetTemporaryAccessURL(ctx context.Context, objectKey string, expiryMinutes int) (*types.TemporaryAccessResponse, error) {
	// 检查对象是否存在
	stat, err := s.client.StatObject(ctx, config.Storage.BucketName, objectKey, minio.StatObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("object not found: %w", err)
	}

	// 如果没有指定过期时间，使用默认值
	if expiryMinutes <= 0 {
		expiryMinutes = 60 // 默认1小时
	}

	// 生成临时访问URL
	expiry := time.Duration(expiryMinutes) * time.Minute
	presignedURL, err := s.client.PresignedGetObject(
		ctx,
		config.Storage.BucketName,
		objectKey,
		expiry,
		url.Values{},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate temporary access URL: %w", err)
	}

	return &types.TemporaryAccessResponse{
		URL:         presignedURL.String(),
		ObjectKey:   objectKey,
		ContentType: stat.ContentType,
		ExpiresAt:   time.Now().Add(expiry).Unix(),
		ExpiresIn:   expiryMinutes * 60, // 转换为秒
	}, nil
}

// 批量获取临时访问URL
func (s *Service) GetBatchTemporaryAccessURLs(ctx context.Context, objectKeys []string, expiryMinutes int) ([]*types.TemporaryAccessResponse, error) {
	var results []*types.TemporaryAccessResponse

	for _, objectKey := range objectKeys {
		result, err := s.GetTemporaryAccessURL(ctx, objectKey, expiryMinutes)
		if err != nil {
			// 跳过错误的文件，继续处理其他文件
			continue
		}
		results = append(results, result)
	}

	return results, nil
}

// 获取文件信息
func (s *Service) GetFileInfo(ctx context.Context, objectKey string) (*types.FileInfo, error) {
	stat, err := s.client.StatObject(ctx, config.Storage.BucketName, objectKey, minio.StatObjectOptions{})
	if err != nil {
		return nil, fmt.Errorf("failed to get object info: %w", err)
	}

	// 生成临时访问URL
	tempAccess, err := s.GetTemporaryAccessURL(ctx, objectKey, 60) // 默认1小时
	if err != nil {
		return nil, err
	}

	return &types.FileInfo{
		ObjectKey:   objectKey,
		FileName:    stat.Key,
		ContentType: stat.ContentType,
		Size:        stat.Size,
		URL:         tempAccess.URL,
		ExpiresAt:   tempAccess.ExpiresAt,
	}, nil
}
