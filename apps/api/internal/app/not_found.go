package app

import (
	"net/http"

	response "github.com/zeroicey/lifetrack-api/internal/pkg"
)

func NotFoundHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response.Error("Url not found").SetStatusCode(404).Build(w)
	}
}
