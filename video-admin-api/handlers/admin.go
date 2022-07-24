package handlers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/video-admin-api/controllers"
)

func AdminsList(c echo.Context) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	admins, err := controllers.GetAdmins()
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string][]string{"admins": admins})

}
