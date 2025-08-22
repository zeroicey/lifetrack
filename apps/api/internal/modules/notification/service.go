package notification

import (
	"strings"

	"go.uber.org/zap"
)

type Mailer interface {
	Send(to, subject, body string) error
}

type Service struct {
	logger *zap.Logger
	mailer Mailer
}

func NewService(logger *zap.Logger, mailer Mailer) *Service {
	return &Service{
		logger: logger,
		mailer: mailer,
	}
}

func (s *Service) SendEmail(to, subject, body string) error {
	s.logger.Info("Attempting to send email", zap.String("to", to), zap.String("subject", subject))
	err := s.mailer.Send(to, subject, body)
	if err != nil {
		if strings.Contains(err.Error(), "sending SMTP RESET command") {
			s.logger.Info("Mail sent successfully, but connection was closed by server before final command.")
			return nil
		}
		s.logger.Error("Failed to send email", zap.Error(err))
		return err
	}
	s.logger.Info("Email sent successfully")
	return nil
}
