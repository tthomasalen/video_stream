package routes

import (
	"github.com/video-admin-api/handlers"
	middleware "github.com/video-admin-api/middleware"

	"github.com/labstack/echo/v4"
)

func Set(e *echo.Echo) {
	e.GET("/status", handlers.Status)
	e.POST("/login", handlers.Login)

	protectedApi := e.Group("/api")
	protectedApi.Use(middleware.Auth())
	protectedApi.GET("/ladmins", handlers.AdminsList)
	protectedApi.GET("/ulist", handlers.UsersList)
	protectedApi.GET("/vlist", handlers.VideosList)
	protectedApi.POST("/upload", handlers.UploadVideo)
	protectedApi.POST("/block", handlers.UserBlock)
	protectedApi.POST("/unblock", handlers.UserUnblock)
	protectedApi.POST("/udelete", handlers.UsersDelete)
	protectedApi.POST("/vdelete", handlers.VideosDelete)
	protectedApi.POST("/ptoggle", handlers.UserPremiumToggle)

}
