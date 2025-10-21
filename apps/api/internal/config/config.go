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
	if err := godotenv.Load(".env"); err != nil {
		return nil, fmt.Errorf("failed to load .env file: %w", err)

	}
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	viper.SetDefault("PORT", "8080")
	viper.SetDefault("APPMODE", "dev")
	config.Port = viper.GetString("APPPORT")
	config.APPMODE = viper.GetString("APPMODE")

	config.DB = NewDBConfig()
	config.JWT = NewJWTConfig()
	config.Storage = NewStorageConfig()
	config.Mail = NewMailConfig()
	return config, nil
}
