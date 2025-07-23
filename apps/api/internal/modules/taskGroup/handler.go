package taskgroup

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"

	taskgroup "github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func TaskGroupRouter(s *Service) chi.Router {
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
	taskGroups, err := h.S.ListGroups(r.Context())
	if err != nil {
		response.Error("Failed to list task groups").Build(w)
		return
	}
	response.Success("List of task groups").SetData(taskGroups).Build(w)
}

func (h *Handler) CreateGroup(w http.ResponseWriter, r *http.Request) {
	var body taskgroup.CreateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	newGroup, err := h.S.CreateGroup(r.Context(), repository.CreateTaskGroupParams{
		Name:        body.Name,
		Description: body.Description,
	})

	if err != nil {
		if err.Error() == "task group not found" {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to update task group").Build(w)
		}
		return
	}

	response.Success("Task group created successfully").SetData(newGroup).Build(w)
}

// With tasks items
func (h *Handler) GetGroupById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").Build(w)
		return
	}

	resp, err := h.S.GetGroupById(r.Context(), id)
	if err != nil {
		if err.Error() == "task group not found" {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get task group details").Build(w)
		}
		return
	}

	response.Success("Task group details").SetData(resp).Build(w)
}

func (h *Handler) UpdateGroup(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").Build(w)
		return
	}

	var body taskgroup.UpdateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	updatedGroup, err := h.S.UpdateGroup(r.Context(), repository.UpdateTaskGroupParams{
		ID:          id,
		Name:        body.Name,
		Description: body.Description,
	})

	if err != nil {
		response.Error(err.Error()).Build(w)
		return
	}

	response.Success("Task group updated successfully").SetData(updatedGroup).Build(w)
}
func (h *Handler) DeleteGroup(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").Build(w)
		return
	}

	err = h.S.DeleteGroup(r.Context(), id)
	if err != nil {
		if err.Error() == "task group not found" {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete task group").Build(w)
		}
		return
	}

	response.Success("Task group deleted successfully").Build(w)
}
