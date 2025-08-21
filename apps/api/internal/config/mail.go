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

var Mail MailConfig

func LoadMail() {
	// 设置默认值
	viper.SetDefault("MAIL_HOST", "smtp.qq.com")
	viper.SetDefault("MAIL_PORT", 587)
	viper.SetDefault("MAIL_USERNAME", "123@qq.com")
	viper.SetDefault("MAIL_PASSWORD", "123")
	viper.SetDefault("MAIL_FROM", "123@qq.com")
	viper.SetDefault("MAIL_TO", "123@qq.com")

	Mail = MailConfig{
		Host:     viper.GetString("MAIL_HOST"),
		Port:     viper.GetInt("MAIL_PORT"),
		Username: viper.GetString("MAIL_USERNAME"),
		Password: viper.GetString("MAIL_PASSWORD"),
		From:     viper.GetString("MAIL_FROM"),
		To:       viper.GetString("MAIL_TO"),
	}

}
