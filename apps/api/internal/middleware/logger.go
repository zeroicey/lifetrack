package middleware

import (
	"net/http"
	"time"

	"github.com/zeroicey/lifetrack-api/internal/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// ANSI 颜色代码常量
const (
	ColorReset  = "\033[0m"
	ColorRed    = "\033[31m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorBlue   = "\033[34m"
	ColorCyan   = "\033[36m"
	ColorGray   = "\033[90m"
)

func Logger(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			ww := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
			next.ServeHTTP(ww, r)

			duration := time.Since(start)

			statusColor := getStatusColor(ww.statusCode)

			logger.Sugar().Infof(
				"%s%-3d%s  %s%-6s%s %-25s %s%-21s%s %s",
				statusColor, ww.statusCode, ColorReset,
				ColorBlue, r.Method, ColorReset,
				r.URL.Path,
				ColorGray, r.RemoteAddr, ColorReset,
				ColorCyan+duration.String()+ColorReset,
			)
		})
	}
}

func getStatusColor(statusCode int) string {
	switch {
	case statusCode >= http.StatusOK && statusCode < http.StatusMultipleChoices: // 2xx 范围
		return ColorGreen
	case statusCode >= http.StatusBadRequest && statusCode < http.StatusInternalServerError: // 4xx 范围
		return ColorRed
	case statusCode >= http.StatusInternalServerError: // 5xx 范围
		return ColorRed
	default: // 其他情况 (如 1xx, 3xx)
		return ColorYellow
	}
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func NewLogger(config *config.Config) (*zap.Logger, error) {
	if config.APPMODE == "prod" {
		return zap.NewProduction()
	}

	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("06-01-02 15:04:05")
	cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	cfg.DisableCaller = true

	return cfg.Build()
}
