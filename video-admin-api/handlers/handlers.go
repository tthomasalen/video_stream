package handlers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/video-admin-api/controllers"
	"github.com/video-admin-api/models"
)

func Status(c echo.Context) error {
	//fmt.Println(fmt.Println(c.Request().Header.Get("token")))
	return c.JSON(http.StatusOK, map[string]string{"msg": "ok"})
}

func Login(c echo.Context) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusUnauthorized, map[string]string{"result": "unauthenticated.."})
		}
	}()

	rb := new(models.LoginReqBody)
	if err1 := c.Bind(rb); err1 != nil {
		panic(err1)
	}

	token, err := controllers.Login(rb.Email, rb.Password)
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"token": token})

}
