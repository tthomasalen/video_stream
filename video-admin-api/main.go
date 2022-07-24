package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/video-admin-api/routes"
	"github.com/video-admin-api/services"
	"github.com/video-admin-api/utils/log"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {

	//set up
	e := echo.New()

	services.LoadResources()
	routes.Set(e)

	//Initialising logger
	l := log.LogUnit{}
	l.Loginit()

	//middlewares
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, "token", "pragma", echo.HeaderCacheControl},
	}))
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Output: l.AccessLogPtr,
	}))

	go func() {
		if err := e.Start(os.Getenv("PORT")); err != nil && err != http.ErrServerClosed {
			log.Logger("error", "shutting down the server")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 10 seconds.
	// Use a buffered channel to avoid missing signals as recommended for signal.Notify
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		log.Logger("error", err)
	}
}
