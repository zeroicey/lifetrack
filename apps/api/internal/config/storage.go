package config

import (
	"github.com/spf13/viper"
)

type StorageConfig struct {
	Provider        string // "minio", "aws", "tencent", "aliyun"
	Endpoint        string
	AccessKey       string
	SecretKey       string
	BucketName      string
	Region          string
	UseSSL          bool
	PresignedExpiry int // 预签名URL过期时间（秒）
}

func NewStorageConfig() *StorageConfig {
	config := &StorageConfig{}

	// 设置默认值
	viper.SetDefault("STORAGE_PROVIDER", "minio")
	viper.SetDefault("STORAGE_ENDPOINT", "localhost:9000")
	viper.SetDefault("STORAGE_ACCESS_KEY", "minioadmin")
	viper.SetDefault("STORAGE_SECRET_KEY", "minioadmin")
	viper.SetDefault("STORAGE_BUCKET_NAME", "lifetrack")
	viper.SetDefault("STORAGE_REGION", "us-east-1")
	viper.SetDefault("STORAGE_USE_SSL", false)
	viper.SetDefault("STORAGE_PRESIGNED_EXPIRY", 10*60)

	config.Provider = viper.GetString("STORAGE_PROVIDER")
	config.Endpoint = viper.GetString("STORAGE_ENDPOINT")
	config.AccessKey = viper.GetString("STORAGE_ACCESS_KEY")
	config.SecretKey = viper.GetString("STORAGE_SECRET_KEY")
	config.BucketName = viper.GetString("STORAGE_BUCKET_NAME")
	config.Region = viper.GetString("STORAGE_REGION")
	config.UseSSL = viper.GetBool("STORAGE_USE_SSL")
	config.PresignedExpiry = viper.GetInt("STORAGE_PRESIGNED_EXPIRY")

	return config
}
