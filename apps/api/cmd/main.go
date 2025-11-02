package main

import "github.com/zeroicey/lifetrack-api/internal/app"

func main() {
	server := app.NewApp()
	server.Run()
}
