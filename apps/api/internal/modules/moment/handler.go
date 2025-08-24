package moment

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

type Handler struct {
	S *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{s}
}

// parseIDFromURL 从URL参数中解析ID，返回解析后的int64值
func parseIDFromURL(r *http.Request, paramName string) (int64, error) {
	idStr := chi.URLParam(r, paramName)
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		return 0, fmt.Errorf("invalid %s", paramName)
	}
	return id, nil
}

func MomentRouter(s *Service) chi.Router {
	h := NewHandler(s)
	r := chi.NewRouter()
	r.Get("/", h.ListMoments)
	r.Post("/", h.CreateMoment)
	r.Get("/{id}", h.GetMomentByID)
	r.Delete("/{id}", h.DeleteMomentByID)
	return r
}

func (h *Handler) ListMoments(w http.ResponseWriter, r *http.Request) {
	cursor, err := func() (int64, error) {
		cursorStr := r.URL.Query().Get("cursor")
		if strings.TrimSpace(cursorStr) == "" {
			return 0, nil
		}
		return strconv.ParseInt(cursorStr, 10, 64)
	}()
	if err != nil {
		response.Error("Invalid cursor").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	limit := func() int {
		limitStr := r.URL.Query().Get("limit")
		if strings.TrimSpace(limitStr) == "" {
			return 10
		}
		if n, parseErr := strconv.Atoi(limitStr); parseErr == nil && n > 0 {
			return min(n, 100)
		}
		return 10
	}()

	moments, nextCursor, err := h.S.ListMomentsPaginated(r.Context(), cursor, limit)
	if err != nil {
		response.Error("Failed to list moments").SetStatusCode(http.StatusInternalServerError).Build(w)
		return
	}
	resp := map[string]any{
		"items":      moments,
		"nextCursor": nextCursor, // Only nextCursor used int64 for pagination
	}
	response.Success("Moments listed successfully").SetStatusCode(http.StatusOK).SetData(resp).Build(w)
}

func (h *Handler) CreateMoment(w http.ResponseWriter, r *http.Request) {
	body, err := func() (types.CreateMomentBody, error) {
		var body types.CreateMomentBody
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			return body, err
		}

		if strings.TrimSpace(body.Content) == "" {
			return body, errors.New("content cannot be empty")
		}

		return body, nil
	}()

	if err != nil {
		response.Error("Failed to decode request body or invalid content").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	newMoment, err := h.S.CreateMoment(r.Context(), body)
	if err != nil {
		response.Error(err.Error()).SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	response.Success("Moment created successfully").SetStatusCode(http.StatusCreated).SetData(newMoment).Build(w)
}

func (h *Handler) GetMomentByID(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromURL(r, "id")
	if err != nil {
		response.Error("Invalid moment ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	moment, err := h.S.GetMomentByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrMomentNotFound) {
			response.Error("Moment not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to get moment").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Moment retrieved successfully").SetStatusCode(http.StatusOK).SetData(moment).Build(w)
}

func (h *Handler) DeleteMomentByID(w http.ResponseWriter, r *http.Request) {
	id, err := parseIDFromURL(r, "id")
	if err != nil {
		response.Error("Invalid moment ID").SetStatusCode(http.StatusBadRequest).Build(w)
		return
	}

	err = h.S.DeleteMomentByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, ErrMomentNotFound) {
			response.Error("Moment not found").SetStatusCode(http.StatusNotFound).Build(w)
		} else {
			response.Error("Failed to delete moment").SetStatusCode(http.StatusInternalServerError).Build(w)
		}
		return
	}

	response.Success("Moment deleted successfully").SetStatusCode(http.StatusOK).Build(w)
}
