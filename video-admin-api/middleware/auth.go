package middlewares

import (
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func Auth() echo.MiddlewareFunc {
	//fmt.Println(c.Request().Header)
	return middleware.JWTWithConfig(middleware.JWTConfig{
		SigningKey: []byte(os.Getenv("JWT_SECRET")),
		//TokenLookup:"cookie:token"
		TokenLookup: "header:token",
		//AuthScheme:  "Bearer",
	})
}
