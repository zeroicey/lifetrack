package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
)

func main() {
	app, err := app.NewApp(context.Background())

	if err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	logger := app.Logger
	defer app.Close()

	// Initialize router
	r := chi.NewRouter()

	// Initialize middleware logger
	r.Use(middleware.Logger(logger))
	r.Use(middleware.Cors())

	// Register routes
	internal.RegisterRoutes(r, app)

	// Start event reminder scheduler
	err = app.SchedulerService.Start()
	if err != nil {
		logger.Sugar().Fatalf("Failed to start scheduler: %v", err)
	}

	// Create HTTP server
	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", app.Config.Port),
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		logger.Sugar().Infof("Server started at :%s", app.Config.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Sugar().Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Sugar().Info("Shutting down server...")

	// Stop the scheduler
	app.SchedulerService.Stop()

	// Shutdown the server with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Sugar().Errorf("Server forced to shutdown: %v", err)
	}

	logger.Sugar().Info("Server exited")
}
