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

var Storage StorageConfig

func LoadStorage() {
	// 设置默认值
	viper.SetDefault("STORAGE_PROVIDER", "minio")
	viper.SetDefault("STORAGE_ENDPOINT", "localhost:9000")
	viper.SetDefault("STORAGE_ACCESS_KEY", "minioadmin")
	viper.SetDefault("STORAGE_SECRET_KEY", "minioadmin")
	viper.SetDefault("STORAGE_BUCKET_NAME", "lifetrack")
	viper.SetDefault("STORAGE_REGION", "us-east-1")
	viper.SetDefault("STORAGE_USE_SSL", false)
	viper.SetDefault("STORAGE_PRESIGNED_EXPIRY", 3600) // 1小时

	Storage = StorageConfig{
		Provider:        viper.GetString("STORAGE_PROVIDER"),
		Endpoint:        viper.GetString("STORAGE_ENDPOINT"),
		AccessKey:       viper.GetString("STORAGE_ACCESS_KEY"),
		SecretKey:       viper.GetString("STORAGE_SECRET_KEY"),
		BucketName:      viper.GetString("STORAGE_BUCKET_NAME"),
		Region:          viper.GetString("STORAGE_REGION"),
		UseSSL:          viper.GetBool("STORAGE_USE_SSL"),
		PresignedExpiry: viper.GetInt("STORAGE_PRESIGNED_EXPIRY"),
	}
}
