package event

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/zeroicey/lifetrack-api/internal/modules/event/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S         *Service
	validator *validator.Validate
}

func NewHandler(s *Service, validator *validator.Validate) *Handler {
	return &Handler{
		S:         s,
		validator: validator,
	}
}

// EventRouter 注册事件相关路由
func EventRouter(s *Service, validator *validator.Validate) chi.Router {
	r := chi.NewRouter()
	h := NewHandler(s, validator)

	r.Get("/", h.ListEvents)
	r.Post("/", h.CreateEvent)
	r.Get("/{id}", h.GetEvent)
	r.Put("/{id}", h.UpdateEvent)
	r.Delete("/{id}", h.DeleteEvent)
	r.Get("/date-range", h.GetEventsByDateRange)

	// 事件提醒相关路由
	r.Post("/{id}/reminders", h.CreateEventReminder)
	r.Delete("/reminders/{reminder_id}", h.DeleteEventReminder)

	return r
}

// ListEvents 获取所有事件列表
func (h *Handler) ListEvents(w http.ResponseWriter, r *http.Request) {
	events, err := h.S.GetAllEvents(r.Context())
	if err != nil {
		response.Error("Failed to get events").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Events retrieved successfully").SetData(events).Build(w)

}

// CreateEvent 创建新事件
func (h *Handler) CreateEvent(w http.ResponseWriter, r *http.Request) {
	var body types.CreateEventBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	if err := h.validator.Struct(body); err != nil {
		response.Error("Validation failed: " + err.Error()).SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	event, err := h.S.CreateEvent(r.Context(), body)
	if err != nil {
		response.Error("Failed to create event").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Event created successfully").SetStatusCode(http.StatusCreated).SetData(event).Build(w)
}

// GetEvent 根据ID获取事件
func (h *Handler) GetEvent(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid event ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	event, err := h.S.GetEventByID(r.Context(), id)
	if err != nil {
		response.Error("Event not found").SetStatusCode(http.StatusNotFound).Build(w)
		return
	}

	response.Success("Event details").SetData(event).Build(w)
}

// UpdateEvent 更新事件
func (h *Handler) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid event ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body types.UpdateEventBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	if err := h.validator.Struct(body); err != nil {
		response.Error("Validation failed: " + err.Error()).SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	event, err := h.S.UpdateEvent(r.Context(), id, body)
	if err != nil {
		response.Error("Failed to update event").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Event updated successfully").SetData(event).Build(w)
}

// DeleteEvent 删除事件
func (h *Handler) DeleteEvent(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid event ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteEvent(r.Context(), id)
	if err != nil {
		response.Error("Failed to delete event").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Event deleted successfully").Build(w)
}

// GetEventsByDateRange 根据日期范围获取事件
func (h *Handler) GetEventsByDateRange(w http.ResponseWriter, r *http.Request) {
	startDateStr := r.URL.Query().Get("start_date")
	endDateStr := r.URL.Query().Get("end_date")

	if startDateStr == "" || endDateStr == "" {
		response.Error("start_date and end_date are required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	// 验证日期格式
	_, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		response.Error("Invalid start_date format, expected YYYY-MM-DD").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	_, err = time.Parse("2006-01-02", endDateStr)
	if err != nil {
		response.Error("Invalid end_date format, expected YYYY-MM-DD").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	events, err := h.S.GetEventsByDateRange(r.Context(), startDateStr, endDateStr)
	if err != nil {
		response.Error("Failed to get events by date range").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Events retrieved successfully").SetData(events).Build(w)
}

// CreateEventReminder 为事件创建提醒
func (h *Handler) CreateEventReminder(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	eventID, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid event ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body types.CreateEventReminderBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	if err := h.validator.Struct(body); err != nil {
		response.Error("Validation failed: " + err.Error()).SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	reminder, err := h.S.CreateEventReminder(r.Context(), eventID, body)
	if err != nil {
		response.Error("Failed to create event reminder").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Event reminder created successfully").SetStatusCode(http.StatusCreated).SetData(reminder).Build(w)
}

// DeleteEventReminder 删除事件提醒
func (h *Handler) DeleteEventReminder(w http.ResponseWriter, r *http.Request) {
	reminderIDStr := chi.URLParam(r, "reminder_id")
	reminderID, err := strconv.ParseInt(reminderIDStr, 10, 64)
	if err != nil {
		response.Error("Invalid reminder ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteEventReminder(r.Context(), reminderID)
	if err != nil {
		response.Error("Failed to delete event reminder").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Event reminder deleted successfully").Build(w)
}
