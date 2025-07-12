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
	r.Get("/", h.ListMemos)
	r.Post("/", h.CreateMemo)
	r.Get("/{id}", h.GetMemoById)
	return r
}

func (h *Handler) ListMemos(w http.ResponseWriter, r *http.Request) {
	// cursorStr is int64, limitStr is int
	cursorStr := r.URL.Query().Get("cursor")
	limitStr := r.URL.Query().Get("limit")

	var cursor int64
	if cursorStr != "" {
		cursor, _ = strconv.ParseInt(cursorStr, 10, 64) // default cursor is 0
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
		"nextCursor": nextCursor, // Only nextCursor used int64 for pagination
	}
	response.Success("Memos listed successfully").SetData(resp).Build(w)
}

func (h *Handler) CreateMemo(w http.ResponseWriter, r *http.Request) {
	var body memo.CreateMemoBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	newMemo, err := h.S.CreateMemo(r.Context(), body)
	if err != nil {
		response.Error(err.Error()).Build(w)
		return
	}

	response.Success("Memo created successfully").SetData(newMemo).Build(w)
}

func (h *Handler) GetMemoById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		response.Error("Invalid memo ID").Build(w)
		return
	}

	memo, err := h.S.Q.GetMemoByID(r.Context(), int64(id))
	if err != nil {
		response.Error("Failed to get memo").Build(w)
		return
	}

	response.Success("Memo retrieved successfully").SetData(memo).Build(w)
}

func (h *Handler) DeleteMemoByID(w http.ResponseWriter, r *http.Request) {
	// Get memo ID from URL parameter
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		response.Error("Invalid memo ID").Build(w)
		return
	}

	// Check if memo exists
	_, err = h.S.Q.GetMemoByID(r.Context(), int64(id))
	if err != nil {
		response.Error("Memo not found").Build(w)
		return
	}

	// Delete memo
	err = h.S.DeleteMemoByID(r.Context(), int64(id))
	if err != nil {
		response.Error("Failed to delete memo").Build(w)
		return
	}

	response.Success("Memo deleted successfully").SetStatusCode(204).Build(w)
}
