package config

import (
	"github.com/spf13/viper"
)

var (
	DBHost string
	DBPort string
	DBUser string
	DBPass string
	DBName string
)

func LoadDB() {
	viper.SetDefault("DB_HOST", "127.0.0.1")
	viper.SetDefault("DB_PORT", "3306")
	viper.SetDefault("DB_USER", "root")
	viper.SetDefault("DB_PASS", "")
	viper.SetDefault("DB_NAME", "test")

	DBHost = viper.GetString("DB_HOST")
	DBPort = viper.GetString("DB_PORT")
	DBUser = viper.GetString("DB_USER")
	DBPass = viper.GetString("DB_PASS")
	DBName = viper.GetString("DB_NAME")
}
