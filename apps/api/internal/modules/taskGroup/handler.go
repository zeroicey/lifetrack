package taskGroup

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
	r.Get("/", h.ListGroups)
	r.Post("/", h.CreateGroup)
	r.Get("/{id}", h.GetGroupById)
	r.Put("/{id}", h.UpdateGroup)
	r.Delete("/{id}", h.DeleteGroup)
	return r
}

// Without tasks items
func (h *Handler) ListGroups(w http.ResponseWriter, r *http.Request) {
	response.Success("List of task groups").Build(w)
}

func (h *Handler) CreateGroup(w http.ResponseWriter, r *http.Request) {
	response.Success("Task group created").Build(w)
}

// With tasks items
func (h *Handler) GetGroupById(w http.ResponseWriter, r *http.Request) {
	response.Success("Task group details").Build(w)
}

func (h *Handler) UpdateGroup(w http.ResponseWriter, r *http.Request) {
	response.Success("Task group updated").Build(w)
}
func (h *Handler) DeleteGroup(w http.ResponseWriter, r *http.Request) {
	response.Success("Task group deleted").Build(w)
}
