package taskgroup

import (
	"context" // 引入 context 包
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type groupIDKey string

// **修正点 2: 创建一个该类型的常量作为 key**
const keyGroupID = groupIDKey("groupID")

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

	r.Route("/{groupID}", func(r chi.Router) {
		r.Use(h.groupIDContext)
		r.Get("/", h.GetGroup)
		r.Put("/", h.UpdateGroup)
		r.Delete("/", h.DeleteGroup)
	})

	return r
}

// ---- 中间件 ----
func (h *Handler) groupIDContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "groupID")
		id, err := strconv.ParseInt(idStr, 10, 64)
		if err != nil || id <= 0 {
			response.Error("Invalid group ID format").Build(w)
			return
		}
		// **修正点 3: 使用我们定义的常量 key**
		ctx := context.WithValue(r.Context(), keyGroupID, id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ---- Handlers ----
func (h *Handler) ListGroups(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	params := types.ListGroupsParams{}

	if name := query.Get("name"); name != "" {
		params.Name = &name
	}
	if groupType := query.Get("type"); groupType != "" {
		params.Type = &groupType
	}

	groups, err := h.S.ListGroups(r.Context(), params)
	if err != nil {
		// **修正点**: 使用正确的链式调用
		response.Error("Failed to retrieve task groups").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	// **修正点**: 使用正确的链式调用
	response.Success("Task groups retrieved successfully").SetData(groups).Build(w)
}

func (h *Handler) CreateGroup(w http.ResponseWriter, r *http.Request) {
	var body types.CreateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		// **修正点**: 使用正确的链式调用
		response.Error("Invalid request body").Build(w)
		return
	}

	groupType, err := h.S.parseType(body.Type)
	if err != nil {
		// **修正点**: 使用正确的链式调用
		response.Error(err.Error()).Build(w)
		return
	}

	params := repository.CreateTaskGroupParams{
		Name:        body.Name,
		Description: body.Description,
		Type:        groupType,
	}

	newGroup, err := h.S.CreateGroup(r.Context(), params)
	if err != nil {
		// **修正点**: 使用正确的链式调用
		response.Error("Failed to create task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	// **修正点**: 使用正确的链式调用
	response.Success("Task group created successfully").SetStatusCode(http.StatusCreated).SetData(newGroup).Build(w)
}

func (h *Handler) GetGroup(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := ctx.Value(keyGroupID).(int64)
	withTasks := r.URL.Query().Get("with_tasks") == "true"

	if withTasks {
		groupWithTasks, err := h.S.GetGroupWithTasksByID(ctx, id)
		if err != nil {
			if errors.Is(err, ErrTaskGroupNotFound) {
				// **修正点**: 使用正确的链式调用
				response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
			} else {
				// **修正点**: 使用正确的链式调用
				response.Error("Failed to retrieve task group with tasks").SetStatusCode(http.StatusInternalServerError).Build(w)
			}
			return
		}
		// **修正点**: 使用正确的链式调用
		response.Success("Task group details with tasks").SetData(groupWithTasks).Build(w)
		return
	}

	group, err := h.S.GetGroupByID(ctx, id)
	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			// **修正点**: 使用正确的链式调用
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			// **修正点**: 使用正确的链式调用
			response.Error("Failed to retrieve task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}
	// **修正点**: 使用正确的链式调用
	response.Success("Task group details").SetData(group).Build(w)
}

func (h *Handler) UpdateGroup(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value(keyGroupID).(int64)

	var body types.UpdateGroupBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		// **修正点**: 使用正确的链式调用
		response.Error("Invalid request body").Build(w)
		return
	}

	params := repository.UpdateTaskGroupByIdParams{
		ID:          id,
		Name:        body.Name,
		Description: body.Description,
		Type:        repository.TaskGroupType(body.Type),
	}

	updatedGroup, err := h.S.UpdateGroup(r.Context(), params)
	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			// **修正点**: 使用正确的链式调用
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			// **修正点**: 使用正确的链式调用
			response.Error("Failed to update task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	// **修正点**: 使用正确的链式调用
	response.Success("Task group updated successfully").SetData(updatedGroup).Build(w)
}

func (h *Handler) DeleteGroup(w http.ResponseWriter, r *http.Request) {
	id := r.Context().Value(keyGroupID).(int64)

	err := h.S.DeleteGroup(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrTaskGroupNotFound) {
			// **修正点**: 使用正确的链式调用
			response.Error("Task group not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			// **修正点**: 使用正确的链式调用
			response.Error("Failed to delete task group").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}
	// **修正点**: 成功的删除操作，data为nil，所以不需要SetData
	response.Success("Task group deleted successfully").Build(w)
}
