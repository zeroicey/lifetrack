package config

import (
	"log"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

var Port string
var APPMODE string

func Load() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("[config] .env file not found, fallback to system env")
	}
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// 读取基本配置
	viper.SetDefault("PORT", "8080")
	viper.SetDefault("APPMODE", "dev")
	Port = viper.GetString("PORT")
	APPMODE = viper.GetString("APPMODE")

	LoadDB()
	LoadJWT()
	LoadStorage()
	LoadMail()
}
