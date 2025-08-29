package app

import (
	"context"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
	"github.com/zeroicey/lifetrack-api/internal/modules/event"
	"github.com/zeroicey/lifetrack-api/internal/modules/habit"
	"github.com/zeroicey/lifetrack-api/internal/modules/habitlog"
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

func DetailedHealthCheckHandler(app *App) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		// 检查数据库连接
		dbStatus := "ok"
		if err := app.DB.Ping(ctx); err != nil {
			dbStatus = "error: " + err.Error()
		}

		response.Success("Detailed health check").SetData(map[string]any{
			"status":    "ok",
			"timestamp": time.Now().Unix(),
			"service":   "lifetrack-api",
			"database":  dbStatus,
		}).Build(w)
	}
}

func RegisterRoutes(r chi.Router, app *App) {
	r.NotFound(NotFoundHandler())

	r.Route("/api", func(api chi.Router) {
		// 详细的健康检查（无需认证）
		api.Get("/health", DetailedHealthCheckHandler(app))

		// 用户相关路由（包含登录注册，部分无需认证）
		api.Mount("/user", user.UserRouter(app.UserService, app.JWTManager))

		// 受保护的API路由组（需要JWT认证）
		api.Group(func(protected chi.Router) {
			// 应用JWT认证中间件
			protected.Use(middleware.JWTAuth(app.JWTManager))

			// 所有需要认证的API
			protected.Mount("/moments", moment.MomentRouter(app.MomentService))
			protected.Mount("/task-groups", taskgroup.TaskGroupRouter(app.TaskGroupService))
			protected.Mount("/tasks", task.TaskRouter(app.TaskService))
			protected.Mount("/events", event.EventRouter(app.EventService, app.Validator))
			protected.Mount("/habits", habit.HabitRouter(app.HabitService))
			protected.Mount("/habit-logs", habitlog.HabitLogRouter(app.HabitLogService))
			protected.Mount("/storage", storage.StorageRouter(app.StorageService, app.Validator))
		})
	})
}
