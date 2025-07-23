package app

import (
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type AppServices struct {
	Moment    *moment.Service
	TaskGroup *taskgroup.Service
	Task      *task.Service
}

func NewAppServices(q *repository.Queries) *AppServices {
	services := &AppServices{
		Moment:    moment.NewService(q),
		TaskGroup: taskgroup.NewService(q),
		Task:      task.NewService(q),
	}
	return services
}
