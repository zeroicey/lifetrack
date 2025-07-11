package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/zeroicey/lifetrack-api/internal/api"
)

func main() {
	r := chi.NewRouter()
	api.RegisterRoutes(r) // 路由注册

	log.Println("Server started at :8080")
	http.ListenAndServe(":8080", r)
}
