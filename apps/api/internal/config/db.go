package config

import (
	"github.com/spf13/viper"
)

type DBConfig struct {
	DBHost     string
	DBPort     string
	DBUser     string
	DBPASSWORD string
	DBName     string
	DBURL      string
}

func NewDBConfig() *DBConfig {
	config := &DBConfig{}

	viper.SetDefault("DB_HOST", "127.0.0.1")
	viper.SetDefault("DB_PORT", "3306")
	viper.SetDefault("DB_USER", "root")
	viper.SetDefault("DB_PASSWORD", "")
	viper.SetDefault("DB_NAME", "test")

	config.DBHost = viper.GetString("DB_HOST")
	config.DBPort = viper.GetString("DB_PORT")
	config.DBUser = viper.GetString("DB_USER")
	config.DBPASSWORD = viper.GetString("DB_PASSWORD")
	config.DBName = viper.GetString("DB_NAME")

	config.DBURL = "postgres://" + config.DBUser + ":" + config.DBPASSWORD + "@" + config.DBHost + ":" + config.DBPort + "/" + config.DBName + "?sslmode=disable"

	return config
}
