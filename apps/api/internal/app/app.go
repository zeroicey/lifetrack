package app

import (
	"context"
	"fmt"
	"log"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
	"github.com/zeroicey/lifetrack-api/internal/modules/event"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/internal/modules/storage"
	"github.com/zeroicey/lifetrack-api/internal/modules/task"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"github.com/zeroicey/lifetrack-api/internal/scheduler"
	"go.uber.org/zap"
)

type App struct {
	// Basic dependencies
	Logger    *zap.Logger
	Validator *validator.Validate
	DB        *pgxpool.Pool
	Config    *config.Config

	MomentService    *moment.Service
	TaskGroupService *taskgroup.Service
	TaskService      *task.Service
	EventService     *event.Service
	StorageService   *storage.Service
	SchedulerService *scheduler.Scheduler
}

func NewApp(ctx context.Context) (*App, error) {
	// Initialize configuration
	cfg, err := config.NewConfig()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize configuration: %w", err)
	}

	// Initialize logger
	logger, err := middleware.NewLogger()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize logger: %w", err)
	}
	defer logger.Sync()

	// Initialize database connection
	dbConn, err := pgxpool.New(ctx, cfg.DB.DBURL)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database connection: %w", err)
	}

	// Initialize MinIO client
	minioClient, err := minio.New(cfg.Storage.Endpoint, &minio.Options{
		Creds:        credentials.NewStaticV4(cfg.Storage.AccessKey, cfg.Storage.SecretKey, ""),
		BucketLookup: minio.BucketLookupDNS,
		Secure:       cfg.Storage.UseSSL,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create MinIO client: %w", err)
	}

	// Initialize validator
	validate := validator.New(validator.WithRequiredStructEnabled())

	// Initialize repositories
	queries := repository.New(dbConn)

	// Initialize services
	eventService := event.NewService(queries, logger, cfg)
	momentService := moment.NewService(queries, logger)
	taskGroupService := taskgroup.NewService(queries)
	taskService := task.NewService(queries)
	storageService := storage.NewService(queries, minioClient, logger, cfg)
	schedulerService := scheduler.NewScheduler(eventService, logger)

	app := &App{
		Logger:    logger,
		Validator: validate,
		DB:        dbConn,
		Config:    cfg,

		MomentService:    momentService,
		TaskGroupService: taskGroupService,
		TaskService:      taskService,
		EventService:     eventService,
		StorageService:   storageService,
		SchedulerService: schedulerService,
	}

	// Ensure storage bucket exists
	if err := app.StorageService.EnsureBucketExists(ctx); err != nil {
		return nil, fmt.Errorf("failed to ensure bucket exists: %w", err)
	}

	return app, nil
}

func (a *App) Close() error {
	a.Logger.Info("Closing application resources...")

	if a.DB != nil {
		a.Logger.Info("Closing database connection pool...")
		a.DB.Close()
	}

	a.Logger.Info("Flushing logs...")
	if err := a.Logger.Sync(); err != nil {
		log.Printf("Failed to sync logger: %v\n", err)
		return err
	}

	return nil
}
