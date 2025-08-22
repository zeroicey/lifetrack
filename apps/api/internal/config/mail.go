package config

import (
	"github.com/spf13/viper"
)

type MailConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
	To       string
}

func NewMailConfig() *MailConfig {
	config := &MailConfig{}

	// 设置默认值
	viper.SetDefault("MAIL_HOST", "smtp.qq.com")
	viper.SetDefault("MAIL_PORT", 587)
	viper.SetDefault("MAIL_USERNAME", "123@qq.com")
	viper.SetDefault("MAIL_PASSWORD", "123")
	viper.SetDefault("MAIL_FROM", "123@qq.com")
	viper.SetDefault("MAIL_TO", "123@qq.com")

	config.Host = viper.GetString("MAIL_HOST")
	config.Port = viper.GetInt("MAIL_PORT")
	config.Username = viper.GetString("MAIL_USERNAME")
	config.Password = viper.GetString("MAIL_PASSWORD")
	config.From = viper.GetString("MAIL_FROM")
	config.To = viper.GetString("MAIL_TO")

	return config
}
