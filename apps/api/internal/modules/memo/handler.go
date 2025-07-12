package memo

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	memo "github.com/zeroicey/lifetrack-api/internal/modules/memo/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
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
	cursorStr := r.URL.Query().Get("cursor")
	limitStr := r.URL.Query().Get("limit")

	var cursor int64
	if cursorStr != "" {
		cursor, _ = strconv.ParseInt(cursorStr, 10, 64) // 兜底默认0
	}
	limit := 10
	if n, err := strconv.Atoi(limitStr); err == nil && n > 0 {
		limit = min(n, 100)
	}

	memos, nextCursor, err := h.S.ListMemosPaginated(r.Context(), cursor, limit)
	if err != nil {
		response.Error("Failed to list memos").Build(w)
		return
	}
	resp := map[string]any{
		"items":      memos,
		"nextCursor": nextCursor, // 仅 nextCursor 用时间戳 int64
	}
	response.Success("Memos listed successfully").SetData(resp).Build(w)
}

func (h *Handler) CreateMemo(w http.ResponseWriter, r *http.Request) {
	var body memo.CreateMemoBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	// 直接交给 Service 层处理业务和参数
	newMemo, err := h.S.CreateMemo(r.Context(), body)
	if err != nil {
		response.Error(err.Error()).Build(w)
		return
	}

	response.Success("Memo created successfully").SetData(newMemo).Build(w)
}

func (h *Handler) DeleteMemoByID(w http.ResponseWriter, r *http.Request) {

	err := h.S.DeleteMemoByID(r.Context(), 1)
	if err != nil {
		http.Error(w, "Failed to delete memo", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
