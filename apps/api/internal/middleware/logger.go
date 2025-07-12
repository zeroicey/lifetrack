package middleware

import (
	"net/http"
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

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

			// 使用 ResponseWriter 包装器记录状态码
			ww := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}
			next.ServeHTTP(ww, r)

			duration := time.Since(start)

			logger.Sugar().Infof(
				"%s%-3d%s  %s%-6s%s %-25s %s%-21s%s %s",
				ColorGreen, ww.statusCode, ColorReset,
				ColorBlue, r.Method, ColorReset,
				r.URL.Path,
				ColorGray, r.RemoteAddr, ColorReset,
				ColorCyan+duration.String()+ColorReset,
			)

		})
	}
}

// 包装 ResponseWriter 来记录状态码
type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func NewLogger() (*zap.Logger, error) {
	env := os.Getenv("APP_ENV")
	if env == "prod" {
		return zap.NewProduction()
	}
	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.EncodeTime = zapcore.TimeEncoderOfLayout("06:01-02 15:04:05")
	cfg.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	cfg.DisableCaller = true
	return cfg.Build()
}
