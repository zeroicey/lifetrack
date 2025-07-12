package pkg

import (
	"encoding/json"
	"net/http"
)

type Responder struct {
	status     bool
	statusCode int
	message    string
	data       any
}

// Constructor
func NewResponder(status bool, message string, statusCode int, data any) *Responder {
	return &Responder{
		status:     status,
		message:    message,
		statusCode: statusCode,
		data:       data,
	}
}

// Static methods
func Success(message string) *Responder {
	return NewResponder(true, message, http.StatusOK, nil)
}

func Error(message string) *Responder {
	return NewResponder(false, message, http.StatusBadRequest, nil)
}

// Chainable methods
func (r *Responder) SetData(data any) *Responder {
	r.data = data
	return r
}
func (r *Responder) SetStatusCode(code int) *Responder {
	r.statusCode = code
	return r
}

// Build method
func (r *Responder) Build(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(r.statusCode)
	resp := map[string]any{
		"status":  r.status,
		"message": r.message,
		"data":    r.data,
	}
	_ = json.NewEncoder(w).Encode(resp)
}
