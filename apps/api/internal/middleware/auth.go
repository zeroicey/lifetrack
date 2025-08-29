package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/zeroicey/lifetrack-api/internal/pkg"
)

// ContextKey 用于在context中存储用户信息的键类型
type ContextKey string

const (
	// UserIDKey 用户ID在context中的键
	UserIDKey ContextKey = "user_id"
	// UserEmailKey 用户邮箱在context中的键
	UserEmailKey ContextKey = "user_email"
)

// JWTManager 接口定义
type JWTManager interface {
	ValidateToken(token string) (*pkg.JWTClaims, error)
}

// JWTAuth JWT认证中间件
func JWTAuth(jwtManager JWTManager) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 从请求头获取Authorization
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				pkg.Error("Authorization header is required").SetStatusCode(http.StatusUnauthorized).Build(w)
				return
			}

			// 检查Bearer前缀
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				pkg.Error("Invalid authorization header format").SetStatusCode(http.StatusUnauthorized).Build(w)
				return
			}

			token := parts[1]
			if token == "" {
				pkg.Error("Token is required").SetStatusCode(http.StatusUnauthorized).Build(w)
				return
			}

			// 验证token
			claims, err := jwtManager.ValidateToken(token)
			if err != nil {
				pkg.Error("Invalid or expired token").SetStatusCode(http.StatusUnauthorized).Build(w)
				return
			}

			// 将用户信息添加到上下文
			ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
			ctx = context.WithValue(ctx, UserEmailKey, claims.Email)

			// 继续处理请求
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserIDFromContext 从上下文中获取用户ID
func GetUserIDFromContext(ctx context.Context) (int64, bool) {
	userID, ok := ctx.Value(UserIDKey).(int64)
	return userID, ok
}

// GetUserEmailFromContext 从context中获取用户邮箱
func GetUserEmailFromContext(ctx context.Context) (string, bool) {
	email, ok := ctx.Value(UserEmailKey).(string)
	return email, ok
}
