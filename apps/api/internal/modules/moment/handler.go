package moment

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	moment "github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{S: s}
}

func MomentRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Get("/", h.ListMoments)
	r.Post("/", h.CreateMoment)
	r.Get("/{id}", h.GetMomentById)
	r.Delete("/{id}", h.DeleteMomentByID)
	return r
}

func (h *Handler) ListMoments(w http.ResponseWriter, r *http.Request) {
	// cursorStr is int64, limitStr is int
	cursorStr := r.URL.Query().Get("cursor")
	limitStr := r.URL.Query().Get("limit")

	var cursor int64
	if cursorStr != "" {
		cursor, _ = strconv.ParseInt(cursorStr, 10, 64) // default cursor is 0
	}
	limit := 10
	if n, err := strconv.Atoi(limitStr); err == nil && n > 0 {
		limit = min(n, 100)
	}

	moments, nextCursor, err := h.S.ListMomentsPaginated(r.Context(), cursor, limit)
	if err != nil {
		response.Error("Failed to list moments").Build(w)
		return
	}
	resp := map[string]any{
		"items":      moments,
		"nextCursor": nextCursor, // Only nextCursor used int64 for pagination
	}
	response.Success("Moments listed successfully").SetData(resp).Build(w)
}

func (h *Handler) CreateMoment(w http.ResponseWriter, r *http.Request) {
	var body moment.CreateMomentBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		response.Error("Failed to decode request body").Build(w)
		return
	}

	newMoment, err := h.S.CreateMoment(r.Context(), body)
	if err != nil {
		response.Error(err.Error()).Build(w)
		return
	}

	response.Success("Moment created successfully").SetData(newMoment).Build(w)
}

func (h *Handler) GetMomentById(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		response.Error("Invalid moment ID").Build(w)
		return
	}

	moment, err := h.S.GetMomentByID(r.Context(), int64(id))
	if err != nil {
		if err.Error() == "moment not found" {
			response.Error("Moment not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get moment").Build(w)
		}
		return
	}

	response.Success("Moment retrieved successfully").SetData(moment).Build(w)
}

func (h *Handler) DeleteMomentByID(w http.ResponseWriter, r *http.Request) {
	// Get moment ID from URL parameter
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		response.Error("Invalid moment ID").Build(w)
		return
	}

	err = h.S.DeleteMomentByID(r.Context(), int64(id))
	if err != nil {
		if err.Error() == "moment not found" {
			response.Error("Moment not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete moment").Build(w)
		}
		return
	}

	response.Success("Moment deleted successfully").SetStatusCode(200).Build(w)
}
