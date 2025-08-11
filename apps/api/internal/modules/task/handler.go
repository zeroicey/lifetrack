package task

import (
	"encoding/json"
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
	r.Get("/{id}", h.GetTaskById)
	r.Put("/{id}", h.UpdateTask)
	r.Delete("/{id}", h.DeleteTask)

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
		Pos:         body.Pos,
		Content:     body.Content,
		Description: body.Description,
		Deadline:    body.Deadline,
	})

	if err != nil {
		if err.Error() == "task group not found" {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to create task").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task created successfully").SetStatusCode(http.StatusCreated).SetData(newTask).Build(w)
}

func (h *Handler) GetTaskById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid task ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	task, err := h.S.GetTaskById(r.Context(), id)
	if err != nil {
		if err.Error() == "task not found" {
			response.Error("Task not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get task details").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task details").SetStatusCode(http.StatusOK).SetData(task).Build(w)
}

func (h *Handler) UpdateTask(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
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
		Pos:         body.Pos,
		Content:     body.Content,
		Description: body.Description,
		Deadline:    body.Deadline,
		Status:      repository.TaskStatus(body.Status),
	})

	if err != nil {
		if err.Error() == "task not found" {
			response.Error("Task not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to update task").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task updated successfully").SetStatusCode(http.StatusOK).SetData(updatedTask).Build(w)
}

func (h *Handler) DeleteTask(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid task ID").Build(w)
		return
	}

	err = h.S.DeleteTask(r.Context(), id)
	if err != nil {
		if err.Error() == "task not found" {
			response.Error("Task not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete task").Build(w)
		}
		return
	}

	response.Success("Task deleted successfully").Build(w)
}
