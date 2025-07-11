package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/memo"
)

func RegisterRoutes(r chi.Router) {
	r.Route("/api", func(api chi.Router) {
		api.Mount("/memo", memo.MemoRouter())
	})
}
