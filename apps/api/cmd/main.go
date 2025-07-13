package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskGroup"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

func main() {
	// Load configuration
	config.Load()

	// Initialize logger
	logger, err := middleware.NewLogger()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	// Initialize router
	r := chi.NewRouter()

	r.Use(middleware.Logger(logger))

	// Initialize database connection
	ctx := context.Background()
	dbConn, err := internal.NewDB(ctx)
	if err != nil {
		logger.Sugar().Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	// Initialize repository and services
	queries := repository.New(dbConn)
	services := &app.AppServices{
		Memo:      memo.NewService(queries),
		TaskGroup: taskGroup.NewService(queries),
	}

	// Register routes
	internal.RegisterRoutes(r, services)

	logger.Sugar().Infof("Server started at :%s", config.Port)

	// Start server
	err = http.ListenAndServe(fmt.Sprintf(":%s", config.Port), r)
	if err != nil {
		logger.Sugar().Fatalf("Failed to start server: %v", err)
	}
}
