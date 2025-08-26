package habitlog

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/habitlog/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func HabitLogRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Post("/", h.CreateHabitLog)
	r.Post("/now", h.CreateHabitLogNow)
	r.Get("/", h.GetAllHabitLogs)
	r.Get("/{id}", h.GetHabitLogById)
	r.Put("/{id}", h.UpdateHabitLog)
	r.Delete("/{id}", h.DeleteHabitLog)
	r.Get("/habit/{habit_id}", h.GetHabitLogsByHabitId)
	r.Delete("/habit/{habit_id}", h.DeleteHabitLogsByHabitId)
	r.Get("/habit/{habit_id}/count", h.GetHabitLogsCountByHabitId)

	return r
}

func (h *Handler) CreateHabitLog(w http.ResponseWriter, r *http.Request) {
	var body types.CreateHabitLogBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habitLog, err := h.S.CreateHabitLog(r.Context(), body)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to create habit log").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit log created successfully").SetStatusCode(http.StatusCreated).SetData(habitLog).Build(w)
}

func (h *Handler) CreateHabitLogNow(w http.ResponseWriter, r *http.Request) {
	habitIdStr := r.URL.Query().Get("habit_id")
	if habitIdStr == "" {
		response.Error("habit_id is required").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habitId, err := strconv.ParseInt(habitIdStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit_id").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habitLog, err := h.S.CreateHabitLogNow(r.Context(), habitId)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to create habit log").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit log created successfully").SetStatusCode(http.StatusCreated).SetData(habitLog).Build(w)
}

func (h *Handler) GetHabitLogById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit log ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habitLog, err := h.S.GetHabitLogById(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrHabitLogNotFound) {
			response.Error("Habit log not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to get habit log").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit log details").SetStatusCode(http.StatusOK).SetData(habitLog).Build(w)
}

func (h *Handler) GetAllHabitLogs(w http.ResponseWriter, r *http.Request) {
	habitLogs, err := h.S.GetAllHabitLogs(r.Context())
	if err != nil {
		response.Error("Failed to get habit logs").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit logs retrieved successfully").SetStatusCode(http.StatusOK).SetData(habitLogs).Build(w)
}

func (h *Handler) GetHabitLogsByHabitId(w http.ResponseWriter, r *http.Request) {
	habitIdStr := chi.URLParam(r, "habit_id")
	habitId, err := strconv.ParseInt(habitIdStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}
	habitLogs, err := h.S.GetHabitLogsByHabitId(r.Context(), habitId)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to get habit logs").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit logs retrieved successfully").SetStatusCode(http.StatusOK).SetData(habitLogs).Build(w)
}

func (h *Handler) UpdateHabitLog(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit log ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body types.UpdateHabitLogBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habitLog, err := h.S.UpdateHabitLogById(r.Context(), id, body.HappenedAt)
	if err != nil {
		if errors.Is(err, ErrHabitLogNotFound) {
			response.Error("Habit log not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to update habit log").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit log updated successfully").SetStatusCode(http.StatusOK).SetData(habitLog).Build(w)
}

func (h *Handler) DeleteHabitLog(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit log ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteHabitLogById(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrHabitLogNotFound) {
			response.Error("Habit log not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to delete habit log").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit log deleted successfully").SetStatusCode(http.StatusOK).Build(w)
}

func (h *Handler) DeleteHabitLogsByHabitId(w http.ResponseWriter, r *http.Request) {
	habitIDStr := chi.URLParam(r, "habit_id")
	habitID, err := strconv.ParseInt(habitIDStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteHabitLogsByHabitId(r.Context(), habitID)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to delete habit logs").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit logs deleted successfully").SetStatusCode(http.StatusOK).Build(w)
}

func (h *Handler) GetHabitLogsCountByHabitId(w http.ResponseWriter, r *http.Request) {
	habitIDStr := chi.URLParam(r, "habit_id")
	habitID, err := strconv.ParseInt(habitIDStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	count, err := h.S.GetHabitLogsCountByHabitId(r.Context(), habitID)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to get habit logs count").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit logs count retrieved successfully").SetStatusCode(http.StatusOK).SetData(count).Build(w)
}
