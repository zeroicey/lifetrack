package internal

import (
	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
)

func RegisterRoutes(r chi.Router, s *app.AppServices) {
	r.NotFound(app.NotFoundHandler())
	r.Route("/api", func(api chi.Router) {
		api.Mount("/memos", memo.MemoRouter(s.Memo))
	})
}
