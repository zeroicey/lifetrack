package config

import (
	"github.com/spf13/viper"
)

type StorageConfig struct {
	Endpoint        string
	AccessKey       string
	SecretKey       string
	BucketName      string
	UseSSL          bool
	PresignedExpiry int
}

func NewStorageConfig() *StorageConfig {
	config := &StorageConfig{}

	// 设置默认值
	viper.SetDefault("STORAGE_ENDPOINT", "localhost:9000")
	viper.SetDefault("STORAGE_ACCESS_KEY", "minioadmin")
	viper.SetDefault("STORAGE_SECRET_KEY", "minioadmin")
	viper.SetDefault("STORAGE_BUCKET_NAME", "lifetrack")
	viper.SetDefault("STORAGE_USE_SSL", false)
	viper.SetDefault("STORAGE_PRESIGNED_EXPIRY", 10*60)

	config.Endpoint = viper.GetString("STORAGE_ENDPOINT")
	config.AccessKey = viper.GetString("STORAGE_ACCESS_KEY")
	config.SecretKey = viper.GetString("STORAGE_SECRET_KEY")
	config.BucketName = viper.GetString("STORAGE_BUCKET_NAME")
	config.UseSSL = viper.GetBool("STORAGE_USE_SSL")
	config.PresignedExpiry = viper.GetInt("STORAGE_PRESIGNED_EXPIRY")

	return config
}
