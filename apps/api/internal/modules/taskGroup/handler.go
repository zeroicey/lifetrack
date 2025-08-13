package taskgroup

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	taskgroup "github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
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

	r.Get("/", h.ListOrSearchGroups)
	r.Post("/", h.CreateGroup)

	r.Route("/{identifier}", func(r chi.Router) {
		r.Get("/", h.GetGroup)
		r.Put("/", h.UpdateGroup)
		r.Delete("/", h.DeleteGroup)
	})

	return r
}

func (h *Handler) ListOrSearchGroups(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	groupType := r.URL.Query().Get("type")

	if groupType != "" {
		groups, err := h.S.ListGroupsByType(ctx, groupType)
		if err != nil {
			response.Error("Failed to list task groups by type").SetStatusCode(http.StatusBadRequest).Build(w)
			return
		}
		response.Success("List of task groups by type").SetStatusCode(http.StatusOK).SetData(groups).Build(w)
		return
	}

	taskGroups, err := h.S.ListGroups(ctx)
	if err != nil {
		response.Error("Failed to list task groups").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}
	response.Success("List of task groups").SetStatusCode(http.StatusOK).SetData(taskGroups).Build(w)
}

func (h *Handler) CreateGroup(w http.ResponseWriter, r *http.Request) {
	var body taskgroup.CreateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	newGroup, err := h.S.CreateGroup(r.Context(), repository.CreateTaskGroupParams{
		Name:        body.Name,
		Description: body.Description,
		Type:        h.S.mustParseType(body.Type),
	})

	if err != nil {
		response.Error("Failed to create task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Task group created successfully").SetStatusCode(http.StatusCreated).SetData(newGroup).Build(w)
}

func (h *Handler) GetGroup(w http.ResponseWriter, r *http.Request) {
	identifier := chi.URLParam(r, "identifier")
	ctx := r.Context()

	var groupWithTasks *taskgroup.TaskGroupWithTasksResponse
	var err error

	id, parseErr := strconv.ParseInt(identifier, 10, 64)

	if parseErr == nil && id > 0 {
		groupWithTasks, err = h.S.GetGroupById(ctx, id)
	} else {
		groupWithTasks, err = h.S.GetGroupByName(ctx, identifier)
	}

	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task group details").SetStatusCode(http.StatusOK).SetData(groupWithTasks).Build(w)
}

func (h *Handler) UpdateGroup(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body taskgroup.UpdateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	updatedGroup, err := h.S.UpdateGroup(r.Context(), repository.UpdateTaskGroupByIdParams{
		ID:          id,
		Name:        body.Name,
		Description: body.Description,
		// Only update type if provided; otherwise preserve in service
		Type: func() repository.TaskGroupType {
			if body.Type == "" {
				return ""
			}
			return h.S.mustParseType(body.Type)
		}(),
	})

	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to update task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task group updated successfully").SetStatusCode(http.StatusOK).SetData(updatedGroup).Build(w)
}
func (h *Handler) DeleteGroup(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		response.Error("Invalid group ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteGroup(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Task group deleted successfully").SetStatusCode(http.StatusOK).Build(w)
}
