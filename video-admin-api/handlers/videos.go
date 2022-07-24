package handlers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/video-admin-api/controllers"
	"github.com/video-admin-api/models"
)

func VideosList(c echo.Context) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	usersVideo, err := controllers.ListVideos()
	if err != nil {
		panic(err)
	}
	return c.JSON(http.StatusOK, map[string][]models.VList{"videos": usersVideo})
}

func VideosDelete(c echo.Context) error {
	var id map[string]int
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	if err1 := c.Bind(&id); err1 != nil {
		panic(err1)
	}

	err := controllers.DelVideos(id["id"])
	if err != nil {
		panic(err)
	}
	return c.JSON(http.StatusOK, map[string]string{"msg": "video deleted"})
}

func UploadVideo(c echo.Context) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	payload := new(models.Payload)

	payload.Title = c.FormValue("title")
	payload.Premium = c.FormValue("premium")
	payload.Description = c.FormValue("description")

	form, err := c.MultipartForm()
	if err != nil {
		fmt.Println(err)
	}

	err = controllers.UploadVideos(form, payload)
	if err != nil {
		panic(err)
	}
	return c.JSON(http.StatusOK, map[string]string{"msg": "upload success"})
}
