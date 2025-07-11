package api

import "github.com/go-chi/chi"

func RegisterRoutes(r chi.Router) {
	r.Route("/users", func(r chi.Router) {
	})
}
