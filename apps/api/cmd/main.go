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
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
)

func main() {
	APP, err := app.NewApp(context.Background())

	if err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	logger := APP.Logger
	defer APP.Close()

	// Initialize router
	r := chi.NewRouter()

	// Initialize middleware logger
	r.Use(middleware.Logger(logger))
	r.Use(middleware.Cors())

	// Register routes
	app.RegisterRoutes(r, APP)

	// Start event reminder scheduler
	if err = APP.StartSchedulers(); err != nil {
		logger.Sugar().Fatalf("Failed to start scheduler: %v", err)
	}

	// Create HTTP server
	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", APP.Config.Port),
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		logger.Sugar().Infof("Server started at :%s", APP.Config.Port)
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
	APP.StopSchedulers()

	// Shutdown the server with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Sugar().Errorf("Server forced to shutdown: %v", err)
	}

	logger.Sugar().Info("Server exited")
}
