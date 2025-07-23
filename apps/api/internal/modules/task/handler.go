package task

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func TaskRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Get("/", h.helloworld)
	return r
}

func (h *Handler) helloworld(w http.ResponseWriter, r *http.Request) {
	response.Success("hello world").Build(w)
}
