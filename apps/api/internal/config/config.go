package config

import (
	"fmt"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	Port    string
	APPMODE string
	DB      *DBConfig
	JWT     *JWTConfig
	Storage *StorageConfig
	Mail    *MailConfig
}

func NewConfig() (*Config, error) {
	config := &Config{}
	// 让 .env 文件加载变为可选，如果文件不存在就跳过
	if err := godotenv.Load(".env"); err != nil {
		// 只记录警告，不返回错误
		fmt.Printf("Warning: failed to load .env file (this is OK in containerized environments): %v\n", err)
	}
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	viper.SetDefault("APPMODE", "dev")
	config.Port = "5000"
	config.APPMODE = viper.GetString("APPMODE")

	config.DB = NewDBConfig()
	config.JWT = NewJWTConfig()
	config.Storage = NewStorageConfig()
	config.Mail = NewMailConfig()
	return config, nil
}
