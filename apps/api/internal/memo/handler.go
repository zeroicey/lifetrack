package memo

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	memo "github.com/zeroicey/lifetrack-api/internal/memo/types"
	"github.com/zeroicey/lifetrack-api/internal/pkg"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func MemoRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Get("/memos", h.ListMemos)
	r.Post("/memos", h.CreateMemo)
	return r
}

func (h *Handler) ListMemos(w http.ResponseWriter, r *http.Request) {
	var query memo.PaginatedQuery

	// 从 query param 里取值
	query.Cursor = r.URL.Query().Get("cursor")

	// limit 默认为 15
	limitStr := r.URL.Query().Get("limit")
	if limitStr == "" {
		query.Limit = 15
	} else {
		// 尝试转换
		if n, err := strconv.Atoi(limitStr); err == nil && n > 0 {
			if n > 100 {
				query.Limit = 100 // 限制最大值为 100
			} else {
				query.Limit = n // 使用用户提供的值
			}
		} else {
			query.Limit = 15 // 兜底
		}
	}

	// Convert cursor string to pgtype.Timestamp
	cursor := pkg.StringToPgTimestamp(query.Cursor)

	_memos, err := h.S.ListMemos(r.Context(), repository.ListMemosWithCursorParams{
		Column1: cursor,
		Limit:   int32(query.Limit),
	})
	if err != nil {
		http.Error(w, "Failed to list memos", http.StatusInternalServerError)
		return
	}

	if len(_memos) == 0 {
		response.Success("No memos found").SetData([]memo.MemoResponse{}).Build(w)
		return
	}

	// Convert every attachment to json
	var memos []memo.MemoResponse
	for _, m := range _memos {
		attachments, err := pkg.UnmarshalJSONB[[]memo.Attachment](m.Attachments)
		fmt.Printf("attachments: %v\n", attachments)
		if err != nil {
			response.Error("Failed to process attachments").Build(w)
			return
		}
		memos = append(memos, memo.MemoResponse{
			ID:          m.ID,
			Content:     m.Content,
			Attachments: attachments,
			UpdatedAt:   m.UpdatedAt.Time.String(),
			CreatedAt:   m.CreatedAt.Time.String(),
		})
	}

	response.Success("Memos found").SetData(memos).Build(w)
}

func (h *Handler) CreateMemo(w http.ResponseWriter, r *http.Request) {
	var body memo.CreateMemoBody

	// Decoding request body
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	// Validate content
	if body.Content == "" {
		response.Error("Content is required").Build(w)
		return
	}

	// Validate attachments
	if body.Attachments != nil {
		for _, attachment := range body.Attachments {
			if attachment.Type == "" || attachment.URL == "" {
				response.Error("Invalid attachment").Build(w)
				return
			}
			if _, ok := memo.AttachmentTypes[attachment.Type]; !ok {
				response.Error("attachment.type only supports image/audio/video").Build(w)
				return
			}
		}
	}

	// Convert attachments to JSONB
	attachmentsJSONB, err := pkg.MarshalJSONB(body.Attachments)
	if err != nil {
		response.Error("Failed to process attachments").Build(w)
		return
	}

	// Create memo
	newMemo, err := h.S.CreateMemo(r.Context(), repository.CreateMemoParams{
		Content:     body.Content,
		Attachments: attachmentsJSONB,
	})
	if err != nil {
		response.Error("Failed to create memo").Build(w)
		return
	}

	response.Success("Memo created successfully").SetData(memo.MemoResponse{
		ID:          newMemo.ID,
		Content:     newMemo.Content,
		Attachments: body.Attachments,
		UpdatedAt:   newMemo.UpdatedAt.Time.String(),
		CreatedAt:   newMemo.CreatedAt.Time.String(),
	}).Build(w)
}

func (h *Handler) DeleteMemoByID(w http.ResponseWriter, r *http.Request) {

	err := h.S.DeleteMemoByID(r.Context(), 1)
	if err != nil {
		http.Error(w, "Failed to delete memo", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
