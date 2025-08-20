package internal

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-playground/validator/v10"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/modules/event"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
)

func RegisterRoutes(r chi.Router, s *app.AppServices, validate *validator.Validate) {
	r.NotFound(app.NotFoundHandler())
	r.Route("/api", func(api chi.Router) {
		api.Mount("/moments", moment.MomentRouter(s.Moment))
		api.Mount("/task-groups", taskgroup.TaskGroupRouter(s.TaskGroup))
		api.Mount("/tasks", task.TaskRouter(s.Task))
		api.Mount("/events", event.EventRouter(s.Event, validate))
		api.Mount("/storage", storage.StorageRouter(s.Storage, validate))
	})
}
