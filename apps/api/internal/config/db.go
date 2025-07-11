package config

import (
	"github.com/spf13/viper"
)

var (
	DBHost     string
	DBPort     string
	DBUser     string
	DBPASSWORD string
	DBName     string
	DBURL      string
)

func LoadDB() {
	viper.SetDefault("DB_HOST", "127.0.0.1")
	viper.SetDefault("DB_PORT", "3306")
	viper.SetDefault("DB_USER", "root")
	viper.SetDefault("DB_PASSWORD", "")
	viper.SetDefault("DB_NAME", "test")

	DBHost = viper.GetString("DB_HOST")
	DBPort = viper.GetString("DB_PORT")
	DBUser = viper.GetString("DB_USER")
	DBPASSWORD = viper.GetString("DB_PASSWORD")
	DBName = viper.GetString("DB_NAME")

	DBURL = "postgres://" + DBUser + ":" + DBPASSWORD + "@" + DBHost + ":" + DBPort + "/" + DBName + "?sslmode=disable"
}
