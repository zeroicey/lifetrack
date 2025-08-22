package notification

import (
	"github.com/wneessen/go-mail"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"go.uber.org/zap"
)

// SMTPMailer 使用 SMTP 协议发送邮件
type SMTPMailer struct {
	client *mail.Client
	config *config.MailConfig // 依然需要 from address
	logger *zap.Logger
}

// NewSMTPMailer 接收一个已经配置好的 mail.Client 作为依赖
func NewSMTPMailer(client *mail.Client, cfg *config.MailConfig, logger *zap.Logger) *SMTPMailer {
	return &SMTPMailer{
		client: client,
		config: cfg,
		logger: logger,
	}
}

// Send 方法保持不变
func (m *SMTPMailer) Send(to, subject, body string) error {
	msg := mail.NewMsg()
	if err := msg.From(m.config.From); err != nil {
		return err
	}
	if err := msg.To(to); err != nil {
		return err
	}
	msg.Subject(subject)
	msg.SetBodyString(mail.TypeTextPlain, body)

	return m.client.DialAndSend(msg)
}
