package config

import (
	"strings"

	"github.com/gofiber/fiber/v2/log"
	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type Config struct {
	APP_Port string
	APP_MODE string
	DB       *DBConfig
	JWT      *JWTConfig
	Storage  *StorageConfig
}

func MustLoad() *Config {
	config := &Config{}
	if err := godotenv.Load(".env"); err != nil {
		log.Panicf("Warning: failed to load .env file: %v\n", err)
	}
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	viper.SetDefault("APPMODE", "dev")
	config.APP_Port = viper.GetString("APP_PORT")
	config.APP_MODE = viper.GetString("APP_MODE")

	config.DB = NewDBConfig()
	config.JWT = NewJWTConfig()
	config.Storage = NewStorageConfig()

	log.Info("✅ Loaded .env config")
	return config
}
