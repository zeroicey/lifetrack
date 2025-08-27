package habit

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/habit/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func HabitRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Post("/", h.CreateHabit)
	r.Get("/", h.GetAllHabits)
	r.Get("/{id}", h.GetHabitById)
	r.Put("/{id}", h.UpdateHabit)
	r.Delete("/{id}", h.DeleteHabit)

	return r
}

func (h *Handler) CreateHabit(w http.ResponseWriter, r *http.Request) {
	var body types.CreateHabitBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habit, err := h.S.CreateHabit(r.Context(), body)
	if err != nil {
		response.Error("Failed to create habit").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit created successfully").SetStatusCode(http.StatusCreated).SetData(habit).Build(w)
}

func (h *Handler) GetHabitById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	habit, err := h.S.GetHabitById(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to get habit").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit details").SetStatusCode(http.StatusOK).SetData(habit).Build(w)
}

func (h *Handler) GetAllHabits(w http.ResponseWriter, r *http.Request) {
	habits, err := h.S.GetAllHabits(r.Context())
	if err != nil {
		response.Error("Failed to get habits").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habits retrieved successfully").SetStatusCode(http.StatusOK).SetData(habits).Build(w)
}

func (h *Handler) UpdateHabit(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	var body types.UpdateHabitBody
	if err = json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Invalid request body").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	updatedHabit, err := h.S.UpdateHabitById(r.Context(), id, body)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to update habit").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit updated successfully").SetStatusCode(http.StatusOK).SetData(updatedHabit).Build(w)
}

func (h *Handler) DeleteHabit(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		response.Error("Invalid habit ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteHabitById(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrHabitNotFound) {
			response.Error("Habit not found").SetStatusCode(http.StatusNotFound).Build(w)
			return
		}
		response.Error("Failed to delete habit").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}

	response.Success("Habit deleted successfully").SetStatusCode(http.StatusOK).Build(w)
}
