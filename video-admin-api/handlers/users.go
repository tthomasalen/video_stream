package handlers

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/video-admin-api/controllers"
	"github.com/video-admin-api/models"
)

func UsersList(c echo.Context) error {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	usersList, err := controllers.GetUsers()
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string][]models.User{"users": usersList})
}

func UsersDelete(c echo.Context) error {
	var email map[string]string
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	if err := c.Bind(&email); err != nil {
		panic(err)
	}

	err := controllers.DelUsers(email["email"])
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"msg": "user deleted"})
}

func UserBlock(c echo.Context) error {
	var email map[string]string
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	if err := c.Bind(&email); err != nil {
		panic(err)
	}

	//err := controllers.BlockUsers(c.FormValue("email"))
	err := controllers.BlockUsers(email["email"])
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"msg": "user Blocked"})
}

func UserUnblock(c echo.Context) error {
	var email map[string]string
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	if err := c.Bind(&email); err != nil {
		panic(err)
	}

	err := controllers.UnBlockUsers(email["email"])
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"msg": "user Unblocked"})
}

func UserPremiumToggle(c echo.Context) error {
	var email map[string]string
	defer func() {
		if r := recover(); r != nil {
			fmt.Println(r)
			c.JSON(http.StatusOK, map[string]string{"result": "something went wrong.."})
		}
	}()

	if err := c.Bind(&email); err != nil {
		panic(err)
	}

	err := controllers.UserPremiumToggle(email["email"])
	if err != nil {
		panic(err)
	}

	return c.JSON(http.StatusOK, map[string]string{"msg": "user premium status toggled"})
}
