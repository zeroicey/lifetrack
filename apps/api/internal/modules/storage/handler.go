package storage

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S        *Service
	Validate *validator.Validate
}

func NewHandler(s *Service, v *validator.Validate) *Handler {
	return &Handler{S: s, Validate: v}
}

func StorageRouter(s *Service, v *validator.Validate) chi.Router {
	h := NewHandler(s, v)
	r := chi.NewRouter()
	r.Post("/{attachmentID}/completed", h.CompleteUpload)
	r.Post("/presigned/upload", h.GetPresignedUploadURL)
	r.Get("/{attachmentID}/url", h.GetTemporaryAccessURL)
	r.Get("/{attachmentID}/cover-url", h.GetTemporaryAccessCoverURL)
	return r
}

func (h *Handler) GetPresignedUploadURL(w http.ResponseWriter, r *http.Request) {
	var bodies []types.PresignedUploadRequest
	if err := json.NewDecoder(r.Body).Decode(&bodies); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	result, err := h.S.CreateUploadRequest(r.Context(), &bodies)
	if err != nil {
		response.Error("Failed to create upload request: " + err.Error()).SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}
	// 4. 成功响应
	response.Success("Presigned upload URL generated successfully").SetData(result).Build(w)
}
func (h *Handler) CompleteUpload(w http.ResponseWriter, r *http.Request) {
	// 1. 从URL路径中提取 attachmentID
	attachmentIDStr := chi.URLParam(r, "attachmentID")
	attachmentID, err := uuid.Parse(attachmentIDStr)
	if err != nil {
		response.Error("Invalid attachment ID format").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// 2. 调用 Service 层的方法来处理业务逻辑
	err = h.S.CompleteUpload(r.Context(), attachmentID)
	if err != nil {
		// 这里的错误处理可以更精细，比如判断是否是 "not found" 错误
		response.Error("Failed to complete upload: " + err.Error()).SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}
	response.Success("Upload completed successfully").SetStatusCode(http.StatusNoContent).Build(w)
}

func (h *Handler) GetTemporaryAccessURL(w http.ResponseWriter, r *http.Request) {
	// 1. 从路径参数中解析附件ID
	attachmentIDStr := chi.URLParam(r, "attachmentID")
	attachmentID, err := uuid.Parse(attachmentIDStr)
	if err != nil {
		response.Error("Invalid attachment ID format").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	// 2. 调用Service层获取URL
	url, err := h.S.GeneratePresignedGetURL(r.Context(), attachmentID)
	if err != nil {
		// 这里可以根据 service 层返回的错误类型来设置更精确的状态码
		// 例如，如果是 "not found"，则返回 404
		if err.Error() == "attachment not found or not completed" {
			response.Error(err.Error()).SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to generate access URL: " + err.Error()).SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}
	// 3. 将URL包装在JSON对象中返回给客户端
	responseData := map[string]string{
		"url": url,
	}
	response.Success("Temporary access URL generated successfully").SetData(responseData).Build(w)
}

func (h *Handler) GetTemporaryAccessCoverURL(w http.ResponseWriter, r *http.Request) {
	// 1. 从路径参数中解析附件ID
	attachmentIDStr := chi.URLParam(r, "attachmentID")
	attachmentID, err := uuid.Parse(attachmentIDStr)
	if err != nil {
		response.Error("Invalid attachment ID format").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	// 2. 调用Service层获取URL
	url, err := h.S.GeneratePresignedGetCoverURL(r.Context(), attachmentID)
	if err != nil {
		// 这里可以根据 service 层返回的错误类型来设置更精确的状态码
		// 例如，如果是 "not found"，则返回 404
		if err.Error() == "attachment not found or not completed" {
			response.Error(err.Error()).SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to generate access URL: " + err.Error()).SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}
	// 3. 将URL包装在JSON对象中返回给客户端
	responseData := map[string]string{
		"url": url,
	}
	response.Success("Temporary access URL generated successfully").SetData(responseData).Build(w)
}
