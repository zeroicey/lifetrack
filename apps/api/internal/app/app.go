package app

import (
	"log"

	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type AppServices struct {
	Moment    *moment.Service
	TaskGroup *taskgroup.Service
	Task      *task.Service
	Storage   *storage.Service
}

func NewAppServices(q *repository.Queries) *AppServices {
	// 初始化存储服务
	storageService, err := storage.NewService()
	if err != nil {
		log.Fatalf("Failed to initialize storage service: %v", err)
	}

	services := &AppServices{
		Moment:    moment.NewService(q),
		TaskGroup: taskgroup.NewService(q),
		Task:      task.NewService(q),
		Storage:   storageService,
	}
	return services
}
