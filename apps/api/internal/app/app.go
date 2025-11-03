package app

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/minio/minio-go/v7"
	"github.com/zeroicey/lifetrack-api/db"
	"github.com/zeroicey/lifetrack-api/db/dao"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment"
	"github.com/zeroicey/lifetrack-api/storage"
)

type App struct {
	Fiber *fiber.App
	DB    *dao.Queries
	Cfg   *config.Config
	Minio *minio.Client
}

func NewApp() *App {
	cfg := config.MustLoad()
	queries := db.MustConnect(cfg.DB.DBURL)
	minioClient := storage.MustInitMinio(*cfg.Storage)

	app := &App{
		Fiber: newFiber(),
		DB:    queries,
		Cfg:   cfg,
		Minio: minioClient,
	}
	app.registerModules()
	return app
}

func newFiber() *fiber.App {
	app := fiber.New(fiber.Config{
		AppName: "LifeTrack API",
	})

	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	return app
}

func (a *App) registerModules() {
	api := a.Fiber.Group("/api")

	momentRepo := moment.NewRepository(a.DB)
	momentService := moment.NewService(momentRepo, a.Minio, a.Cfg)
	momentHandler := moment.NewHandler(momentService)
	momentHandler.RegisterRoutes(api.Group("/moments"))
}

func (a *App) Run() {
	log.Infof("🚀 Server running on :%s", a.Cfg.APP_Port)
	if err := a.Fiber.Listen(":" + a.Cfg.APP_Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
