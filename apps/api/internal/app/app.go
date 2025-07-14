package app

import (
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type AppServices struct {
	Memo      *memo.Service
	TaskGroup *taskgroup.Service
}

func NewAppServices(q *repository.Queries) *AppServices {
	services := &AppServices{
		Memo:      memo.NewService(q),
		TaskGroup: taskgroup.NewService(q),
	}
	return services
}
