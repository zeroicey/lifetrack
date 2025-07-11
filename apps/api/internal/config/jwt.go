package config

import (
	"github.com/spf13/viper"
)

var (
	JWTSecret string
)

func LoadJWT() {
	viper.SetDefault("JWT_SECRET", "changeme")
	JWTSecret = viper.GetString("JWT_SECRET")
}
