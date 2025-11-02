package moment

import (
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/zeroicey/lifetrack-api/internal/pkg/response"
)

type Handler struct {
	S Service
}

func NewHandler(S Service) *Handler {
	return &Handler{S: S}
}

func (h *Handler) RegisterRoutes(r fiber.Router) {
	r.Get("/", h.List)
	r.Post("/", h.Create)
	r.Get("/:id", h.GetByID)
}

func (h *Handler) List(c *fiber.Ctx) error {
	ctx := c.Context()
	cursor, err := func() (int64, error) {
		cursorStr := c.Query("cursor")
		if strings.TrimSpace(cursorStr) == "" {
			return 0, nil
		}
		return strconv.ParseInt(cursorStr, 10, 64)
	}()
	if err != nil {
		return response.Error("invaild request").SetStatusCode(fiber.StatusBadRequest).Build(c)
	}

	limit := func() int {
		limitStr := c.Query("limit")
		if strings.TrimSpace(limitStr) == "" {
			return 10
		}
		if n, parseErr := strconv.Atoi(limitStr); parseErr == nil && n > 0 {
			return min(n, 100)
		}
		return 10
	}()
	moments, nextCursor, err := h.S.List(ctx, cursor, limit)
	if err != nil {
		return response.Error(err.Error()).SetStatusCode(fiber.StatusInternalServerError).Build(c)
	}

	return response.Success("Get moments successfully").SetData(map[string]any{
		"items":      moments,
		"nextCursor": nextCursor,
	}).Build(c)
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var body CreateMomentRequest
	if err := c.BodyParser(&body); err != nil {
		return response.Error("invaild request").SetStatusCode(fiber.StatusBadRequest).Build(c)
	}
	ctx := c.Context()
	moment, err := h.S.Create(ctx, body)

	if err != nil {
		return response.Error(err.Error()).SetStatusCode(fiber.StatusBadRequest).Build(c)
	}

	return response.OK().SetData(moment).SetStatusCode(fiber.StatusCreated).Build(c)

}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	id, _ := strconv.ParseInt(c.Params("id"), 10, 64)

	ctx := c.Context()
	moment, err := h.S.GetById(ctx, id)
	if err != nil {
		return response.Error(err.Error()).SetStatusCode(fiber.StatusNotFound).Build(c)
	}

	return response.OK().SetData(moment).Build(c)
}
