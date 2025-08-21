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
	"github.com/go-playground/validator/v10"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/zeroicey/lifetrack-api/internal"
	"github.com/zeroicey/lifetrack-api/internal/app"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/middleware"
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

	// Initialize middleware logger
	r.Use(middleware.Logger(logger))

	r.Use(middleware.Cors())

	// Initialize database connection
	ctx := context.Background()
	dbConn, err := internal.NewDB(ctx)
	if err != nil {
		logger.Sugar().Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	// Initialize MinIO storage service
	minioClient, err := minio.New(config.Storage.Endpoint, &minio.Options{
		Creds:        credentials.NewStaticV4(config.Storage.AccessKey, config.Storage.SecretKey, ""),
		BucketLookup: minio.BucketLookupDNS,
		Secure:       config.Storage.UseSSL,
	})
	if err != nil {
		logger.Sugar().Fatalf("Failed to create MinIO client: %v", err)
	}

	// Initialize repository and services
	queries := repository.New(dbConn)
	services := app.NewAppServices(queries, logger, minioClient)

	services.Storage.EnsureBucketExists(ctx)

	validate := validator.New(validator.WithRequiredStructEnabled())

	// Register routes
	internal.RegisterRoutes(r, services, validate)

	// Start event reminder scheduler
	err = services.Scheduler.Start()
	if err != nil {
		logger.Sugar().Fatalf("Failed to start scheduler: %v", err)
	}

	// Create HTTP server
	server := &http.Server{
		Addr:    fmt.Sprintf("0.0.0.0:%s", config.Port),
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		logger.Sugar().Infof("Server started at :%s", config.Port)
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
	services.Scheduler.Stop()

	// Shutdown the server with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		logger.Sugar().Fatalf("Server forced to shutdown: %v", err)
	}

	logger.Sugar().Info("Server exited")
}
