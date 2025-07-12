package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/modules/memo"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

func main() {
	config.Load()
	r := chi.NewRouter()

	ctx := context.Background()
	dbConn, err := internal.NewDB(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()
	queries := repository.New(dbConn)
	services := &internal.AppServices{
		Memo: memo.NewService(queries),
	}
	internal.RegisterRoutes(r, services)

	log.Printf("Server started at :%s", config.Port)
	http.ListenAndServe(fmt.Sprintf(":%s", config.Port), r)
}
