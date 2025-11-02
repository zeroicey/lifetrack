package response

import "github.com/gofiber/fiber/v2"

type Responder struct {
	statusCode int
	message    string
	data       any
}

func New(message string, statusCode int, data any) *Responder {
	return &Responder{
		message:    message,
		statusCode: statusCode,
		data:       data,
	}
}

func Success(message string) *Responder {
	return New(message, fiber.StatusOK, nil)
}

func Error(message string) *Responder {
	return New(message, fiber.StatusBadRequest, nil)
}

func OK() *Responder {
	return New("request successfully", fiber.StatusOK, nil)
}

func Fail() *Responder {
	return New("something went wrong", fiber.StatusBadRequest, nil)
}

func (r *Responder) SetData(data any) *Responder {
	r.data = data
	return r
}

func (r *Responder) SetStatusCode(code int) *Responder {
	r.statusCode = code
	return r
}

func (r *Responder) Build(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": r.message,
	}

	if r.data != nil {
		resp["data"] = r.data
	}

	return c.Status(r.statusCode).JSON(resp)
}
