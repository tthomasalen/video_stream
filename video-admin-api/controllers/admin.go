package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/video-admin-api/container"
	"github.com/video-admin-api/models"
	"github.com/video-admin-api/utils/log"
)

//Get a user details
func GetAdminParam(param, value string) (*models.Admins, error) {
	user := new(models.Admins)
	dbr := container.GetDbReader()
	row := dbr.QueryRow(fmt.Sprintf("SELECT * from admin_users where %s='%s'", param, value))
	err := row.Scan(&user.Id, &user.FullName, &user.Email, &user.Password)

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			log.Logger("info", fmt.Sprintf("No matching for SELECT, param=%s, value=%s", param, value))
		default:
			log.Logger("error", err)
			return user, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while fetching from db"}
		}
	}

	return user, nil
}

func Login(email, pass string) (string, error) {
	mu, err := GetAdminParam("email", email)
	if err != nil {
		log.Logger("error", err)
		return "", models.CustomError{Code: http.StatusInternalServerError, Message: "Something went wrong while getting creds"}
	}

	if mu.Email == email && mu.Password == pass && len(mu.Email) != 0 && len(mu.Password) != 0 {

		token, err := GenerateToken(mu.FullName)

		if err != nil {
			log.Logger("error", err)
			return "", models.CustomError{Code: http.StatusInternalServerError, Message: "Unable to generate token"}
		} else {
			return token, nil
		}
	} else {
		return "", models.CustomError{Code: http.StatusUnauthorized, Message: "Username or password is incorrect"}
	}

}

func GetAdmins() ([]string, error) {
	users := []string{}
	var email string

	dbr := container.GetDbReader()
	row, err := dbr.Query("SELECT email from admin_users")

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			log.Logger("info", fmt.Sprintf("No matching for SELECT query"))
		default:
			log.Logger("error", err)
			return []string{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while fetching from db"}
		}
	}

	for row.Next() {

		err := row.Scan(&email)

		if err != nil {
			log.Logger("error", err)
			return []string{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while scaning the row"}
		}
		users = append(users, email)

	}

	return users, nil

}
