package user

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"

	user "github.com/zeroicey/lifetrack-api/internal/modules/user/types"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func UserRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Post("/register", h.RegisterUser)
	r.Get("/exists", h.CheckUserExists)
	r.Get("/profile", h.GetUser)

	return r
}

// RegisterUser 用户注册接口
func (h *Handler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	var body user.RegisterUserBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// 验证必填字段
	if body.Email == "" {
		response.Error("Email is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	if body.Name == "" {
		response.Error("Name is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	if body.Password == "" {
		response.Error("Password is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	if len(body.Password) < 6 {
		response.Error("Password must be at least 6 characters").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// 对密码进行哈希处理
	hashedPassword, err := h.S.HashPassword(body.Password)
	if err != nil {
		response.Error("Failed to process password").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	newUser, err := h.S.RegisterUser(r.Context(), repository.CreateUserParams{
		Email:        body.Email,
		Name:         body.Name,
		PasswordHash: hashedPassword,
		Birthday:     body.Birthday,
		AvatarBase64: body.AvatarBase64.String,
		Bio:          body.Bio.String,
	})

	if err != nil {
		if errors.Is(err, ErrUserAlreadyExists) {
			response.Error("User already exists. This system only supports one user.").SetStatusCode(http.StatusConflict).Build(w)
			return
		}
		response.Error("Failed to create user").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("User registered successfully").SetData(newUser).SetStatusCode(http.StatusCreated).Build(w)
}

// CheckUserExists 检查用户是否存在接口
func (h *Handler) CheckUserExists(w http.ResponseWriter, r *http.Request) {
	exists, err := h.S.CheckUserExists(r.Context())
	if err != nil {
		response.Error("Failed to check user existence").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("User existence check completed").SetData(user.UserExistsResponse{
		Exists: exists,
	}).Build(w)
}

// GetUser 获取用户信息接口
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	userInfo, err := h.S.GetUser(r.Context())
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			response.Error("User not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to get user information").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("User information retrieved successfully").SetData(userInfo).Build(w)
}
