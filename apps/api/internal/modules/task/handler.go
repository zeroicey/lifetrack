package task

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"

	task "github.com/zeroicey/lifetrack-api/internal/modules/task/types"
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
	r.Post("/", h.CreateTask)

	r.Route("/{identifier}", func(r chi.Router) {
		r.Get("/", h.GetTasksByGroupId)
		r.Put("/", h.UpdateTask)
		r.Delete("/", h.DeleteTask)
	})

	return r
}

func (h *Handler) CreateTask(w http.ResponseWriter, r *http.Request) {
	var body task.CreateTaskBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	newTask, err := h.S.CreateTask(r.Context(), repository.CreateTaskParams{
		GroupID:     body.GroupID,
		Content:     body.Content,
		Description: body.Description,
		Deadline:    body.Deadline,
	})

	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to create task").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task created successfully").SetStatusCode(http.StatusCreated).SetData(newTask).Build(w)
}

func (h *Handler) GetTasksByGroupId(w http.ResponseWriter, r *http.Request) {
	identifier := chi.URLParam(r, "identifier")
	id, err := strconv.ParseInt(identifier, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	tasks, err := h.S.GetTasksByGroupId(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			response.Error("Group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get tasks").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Tasks List").SetStatusCode(http.StatusOK).SetData(tasks).Build(w)
}

func (h *Handler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	identifier := chi.URLParam(r, "identifier")
	id, err := strconv.ParseInt(identifier, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid task ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body task.UpdateTaskBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	updatedTask, err := h.S.UpdateTask(r.Context(), repository.UpdateTaskByIdParams{
		ID:          id,
		Content:     body.Content,
		Description: body.Description,
		Deadline:    body.Deadline,
		Status:      repository.TaskStatus(body.Status),
	})

	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			response.Error("Task not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to update task").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task updated successfully").SetStatusCode(http.StatusOK).SetData(updatedTask).Build(w)
}

func (h *Handler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	identifier := chi.URLParam(r, "identifier")
	id, err := strconv.ParseInt(identifier, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid task ID").Build(w)
		return
	}

	err = h.S.DeleteTask(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrTaskNotFound) {
			response.Error("Task not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete task").Build(w)
		}
		return
	}

	response.Success("Task deleted successfully").Build(w)
}
