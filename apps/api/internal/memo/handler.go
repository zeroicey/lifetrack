package memo

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func RegisterRoutes(r chi.Router) {
	r.Get("/", ListMemos)
	r.Post("/", CreateMemo)
	r.Get("/{id}", GetMemo)
	r.Put("/{id}", UpdateMemo)
	r.Delete("/{id}", DeleteMemo)
}

func ListMemos(w http.ResponseWriter, r *http.Request)  { /* ... */ }
func CreateMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
func GetMemo(w http.ResponseWriter, r *http.Request)    { /* ... */ }
func UpdateMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
func DeleteMemo(w http.ResponseWriter, r *http.Request) { /* ... */ }
