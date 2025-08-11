package storage

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func StorageRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Post("/presigned-upload", h.GetPresignedUploadURL)
	r.Get("/info/{key}", h.GetFileInfo)
	return r
}

// 获取预签名上传URL
func (h *Handler) GetPresignedUploadURL(w http.ResponseWriter, r *http.Request) {
	var req types.PresignedUploadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// TODO: 从JWT或session中获取用户ID
	// userID := getUserIDFromContext(r.Context())

	result, err := h.S.GeneratePresignedUploadURL(r.Context(), req.FileName, req.ContentType)
	if err != nil {
		response.Error("Failed to generate presigned upload URL").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Presigned upload URL generated successfully").SetData(result).Build(w)
}

// 获取预签名下载URL (POST 方式)
func (h *Handler) GetPresignedDownloadURL(w http.ResponseWriter, r *http.Request) {
	var req types.PresignedDownloadRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	result, err := h.S.GeneratePresignedDownloadURL(r.Context(), req.ObjectKey)
	if err != nil {
		response.Error("Failed to generate presigned download URL").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Presigned download URL generated successfully").SetData(result).Build(w)
}

// 获取下载URL (GET 方式)
func (h *Handler) GetDownloadURL(w http.ResponseWriter, r *http.Request) {
	objectKey := chi.URLParam(r, "key")
	if objectKey == "" {
		response.Error("Object key is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	result, err := h.S.GeneratePresignedDownloadURL(r.Context(), objectKey)
	if err != nil {
		response.Error("Failed to generate download URL").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Download URL generated successfully").SetData(result).Build(w)
}

// 删除文件
func (h *Handler) DeleteFile(w http.ResponseWriter, r *http.Request) {
	objectKey := chi.URLParam(r, "key")
	if objectKey == "" {
		response.Error("Object key is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err := h.S.DeleteFile(r.Context(), objectKey)
	if err != nil {
		response.Error("Failed to delete file").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	result := types.DeleteFileResponse{
		Success:   true,
		ObjectKey: objectKey,
	}
	response.Success("File deleted successfully").SetData(result).Build(w)
}

// 获取文件信息
func (h *Handler) GetFileInfo(w http.ResponseWriter, r *http.Request) {
	objectKey := chi.URLParam(r, "key")
	if objectKey == "" {
		response.Error("Object key is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	result, err := h.S.GetFileInfo(r.Context(), objectKey)
	if err != nil {
		response.Error("Failed to get file info").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("File info retrieved successfully").SetData(result).Build(w)
}

// 获取临时访问URL (POST方式，可自定义过期时间)
func (h *Handler) GetTemporaryAccessURL(w http.ResponseWriter, r *http.Request) {
	var req types.TemporaryAccessRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	result, err := h.S.GetTemporaryAccessURL(r.Context(), req.ObjectKey, req.ExpiryMinutes)
	if err != nil {
		response.Error("Failed to generate temporary access URL").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Temporary access URL generated successfully").SetData(result).Build(w)
}

// 批量获取临时访问URL
func (h *Handler) GetBatchTemporaryAccessURLs(w http.ResponseWriter, r *http.Request) {
	var req types.BatchTemporaryAccessRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	results, err := h.S.GetBatchTemporaryAccessURLs(r.Context(), req.ObjectKeys, req.ExpiryMinutes)
	if err != nil {
		response.Error("Failed to generate temporary access URLs").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Temporary access URLs generated successfully").SetData(results).Build(w)
}

// 获取临时访问URL (GET方式，使用默认过期时间)
func (h *Handler) GetTemporaryAccessURLByKey(w http.ResponseWriter, r *http.Request) {
	objectKey := chi.URLParam(r, "key")
	if objectKey == "" {
		response.Error("Object key is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// 从查询参数获取过期时间（可选）
	expiryMinutes := 60 // 默认1小时
	if expiry := r.URL.Query().Get("expiry"); expiry != "" {
		if minutes, err := strconv.Atoi(expiry); err == nil && minutes > 0 {
			expiryMinutes = minutes
		}
	}

	result, err := h.S.GetTemporaryAccessURL(r.Context(), objectKey, expiryMinutes)
	if err != nil {
		response.Error("Failed to generate temporary access URL").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Temporary access URL generated successfully").SetData(result).Build(w)
}
