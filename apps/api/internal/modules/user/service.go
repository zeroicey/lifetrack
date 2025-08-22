package user

import (
	"context"
	"errors"

	"golang.org/x/crypto/bcrypt"

	"github.com/zeroicey/lifetrack-api/internal/modules/user/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

// Sentinel errors for user domain
var (
	ErrUserAlreadyExists = errors.New("user already exists")
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidPassword   = errors.New("invalid password")
)

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

// CheckUserExists 检查系统中是否已有用户
func (s *Service) CheckUserExists(ctx context.Context) (bool, error) {
	exists, err := s.Q.CheckUserExists(ctx)
	if err != nil {
		return false, err
	}
	return exists, nil
}

// RegisterUser 注册新用户（单用户系统，只允许注册一个用户）
func (s *Service) RegisterUser(ctx context.Context, params repository.CreateUserParams) (types.UserResponse, error) {
	// 检查是否已有用户存在
	exists, err := s.CheckUserExists(ctx)
	if err != nil {
		return types.UserResponse{}, err
	}
	if exists {
		return types.UserResponse{}, ErrUserAlreadyExists
	}

	// 创建用户
	user, err := s.Q.CreateUser(ctx, params)
	if err != nil {
		return types.UserResponse{}, err
	}

	return s.convertToUserResponse(user), nil
}

// GetUser 获取用户信息
func (s *Service) GetUser(ctx context.Context) (types.UserResponse, error) {
	user, err := s.Q.GetUser(ctx)
	if err != nil {
		return types.UserResponse{}, ErrUserNotFound
	}

	return s.convertToUserResponse(user), nil
}

// HashPassword 对密码进行哈希处理
func (s *Service) HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// convertToUserResponse 将数据库模型转换为响应模型
func (s *Service) convertToUserResponse(user repository.User) types.UserResponse {
	response := types.UserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		CreatedAt: user.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt: user.UpdatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
	}

	// 处理可选字段
	if user.Birthday.Valid {
		response.Birthday = user.Birthday.Time.Format("2006-01-02")
	}
	if user.AvatarBase64.Valid {
		response.AvatarBase64 = user.AvatarBase64.String
	}
	if user.Bio.Valid {
		response.Bio = user.Bio.String
	}

	return response
}