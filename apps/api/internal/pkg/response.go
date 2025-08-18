package pkg

import (
	"encoding/json"
	"net/http"
)

type Responder struct {
	statusCode int
	message    string
	data       any
}

func NewResponder(message string, statusCode int, data any) *Responder {
	return &Responder{
		message:    message,
		statusCode: statusCode,
		data:       data,
	}
}

func Success(message string) *Responder {
	return NewResponder(message, http.StatusOK, nil)
}

func Error(message string) *Responder {
	return NewResponder(message, http.StatusBadRequest, nil)
}

func (r *Responder) SetData(data any) *Responder {
	r.data = data
	return r
}

func (r *Responder) SetStatusCode(code int) *Responder {
	r.statusCode = code
	return r
}

func (r *Responder) Build(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(r.statusCode)

	resp := map[string]any{
		"message": r.message,
		"data":    r.data,
	}

	if r.data == nil {
		delete(resp, "data")
	}

	_ = json.NewEncoder(w).Encode(resp)
}
