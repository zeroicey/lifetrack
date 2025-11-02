package config

import (
	"github.com/spf13/viper"
)

type JWTConfig struct {
	JWTSecret string
}

func NewJWTConfig() *JWTConfig {
	config := &JWTConfig{}
	viper.SetDefault("JWT_SECRET", "lifetrack-secret")
	config.JWTSecret = viper.GetString("JWT_SECRET")
	return config
}
