package internal

import (
	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
)

func RegisterRoutes(r chi.Router, s *app.AppServices) {
	r.NotFound(app.NotFoundHandler())
	r.Route("/api", func(api chi.Router) {
		api.Mount("/moments", moment.MomentRouter(s.Moment))
		api.Mount("/task-groups", taskgroup.TaskGroupRouter(s.TaskGroup))
		api.Mount("/tasks", task.TaskRouter(s.Task))
		api.Mount("/storage", storage.StorageRouter(s.Storage))
	})
}
