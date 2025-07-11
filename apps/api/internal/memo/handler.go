package memo

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
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
	memos, err := h.S.ListMemos(r.Context())
	if err != nil {
		http.Error(w, "Failed to list memos", http.StatusInternalServerError)
		return
	}
	// 这里可以将查询到的 memos 返回给客户端
	fmt.Printf("memos: %v\n", memos)
}

func (h *Handler) CreateMemo(w http.ResponseWriter, r *http.Request) {
	attachments, err := json.Marshal([]string{"attachment1.txt", "attachment2.jpg"})
	if err != nil {
		http.Error(w, "Failed to marshal attachments", http.StatusInternalServerError)
		return
	}
	memo, err := h.S.CreateMemo(r.Context(), repository.CreateMemoParams{
		Content:     "New Memo",
		Attachments: attachments,
	})
	fmt.Printf("memo: %v\n", memo)
}

func (h *Handler) DeleteMemoByID(w http.ResponseWriter, r *http.Request) {

	err := h.S.DeleteMemoByID(r.Context(), 1)
	if err != nil {
		http.Error(w, "Failed to delete memo", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
