package config

import (
	"log"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

var Port string

func Load() {
	// 先加载.env（全局只需加载一次）
	if err := godotenv.Load(".env"); err != nil {
		log.Println("[config] .env file not found, fallback to system env")
	}
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	// 读取基本配置
	viper.SetDefault("PORT", "8080")
	Port = viper.GetString("PORT")

	// 统一调用其它配置的 Load
	LoadDB()
	LoadJWT()
}
