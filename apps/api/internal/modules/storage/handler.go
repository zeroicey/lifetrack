package storage

import (
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func StorageRouter(s *Service) chi.Router {
	// h := NewHandler(s)
	r := chi.NewRouter()
	// r.Post("/{attachmentID}/completed", h.CompleteUpload)
	return r
}
