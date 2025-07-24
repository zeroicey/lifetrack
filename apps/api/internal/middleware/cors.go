package middleware

import (
	"net/http"

	"github.com/go-chi/cors"
)

// CORS 返回一个跨域中间件
func Cors() func(http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"}, // 或指定域名，例如 http://localhost:3000
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // 预检缓存时间，单位秒
	})
}
