package internal

import (
	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
)

func RegisterRoutes(r chi.Router, s *AppServices) {
	r.Route("/api", func(api chi.Router) {
		api.Mount("/memo", memo.MemoRouter(s.Memo))
	})
}
