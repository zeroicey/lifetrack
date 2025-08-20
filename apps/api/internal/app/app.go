package app

import (
	"github.com/minio/minio-go/v7"
	"github.com/zeroicey/lifetrack-api/internal/modules/event"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type AppServices struct {
	Moment    *moment.Service
	TaskGroup *taskgroup.Service
	Task      *task.Service
	Event     *event.Service
	Storage   *storage.Service
	Logger    *zap.Logger
}

func NewAppServices(q *repository.Queries, logger *zap.Logger, minioClient *minio.Client) *AppServices {
	services := &AppServices{
		Moment:    moment.NewService(q, logger),
		TaskGroup: taskgroup.NewService(q),
		Task:      task.NewService(q),
		Event:     event.NewService(q, logger),
		Storage:   storage.NewService(q, minioClient, logger),
		Logger:    logger,
	}
	return services
}
