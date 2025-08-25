package app

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/event"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/modules/user"
	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

func NotFoundHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response.Error("Api not found").SetStatusCode(http.StatusNotFound).Build(w)
	}
}

func RegisterRoutes(r chi.Router, app *App) {
	r.NotFound(NotFoundHandler())
	r.Route("/api", func(api chi.Router) {
		api.Mount("/moments", moment.MomentRouter(app.MomentService))
		api.Mount("/task-groups", taskgroup.TaskGroupRouter(app.TaskGroupService))
		api.Mount("/tasks", task.TaskRouter(app.TaskService))
		api.Mount("/events", event.EventRouter(app.EventService, app.Validator))
		api.Mount("/storage", storage.StorageRouter(app.StorageService, app.Validator))
		api.Mount("/users", user.UserRouter(app.UserService))
	})
}
