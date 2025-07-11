package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/config"
	"github.com/zeroicey/lifetrack-api/internal/routes"
)

func main() {
	config.Load()
	r := chi.NewRouter()

	routes.RegisterRoutes(r)

	log.Printf("Server started at :%s", config.Port)
	http.ListenAndServe(fmt.Sprintf(":%s", config.Port), r)
}
