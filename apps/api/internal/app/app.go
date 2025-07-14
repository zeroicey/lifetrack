package app

import (
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskGroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type AppServices struct {
	Memo      *memo.Service
	TaskGroup *taskGroup.Service
}

func NewAppServices(q *repository.Queries) *AppServices {
	services := &AppServices{
		Memo:      memo.NewService(q),
		TaskGroup: taskGroup.NewService(q),
	}
	return services
}
