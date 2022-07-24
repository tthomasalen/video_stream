package controllers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/video-admin-api/container"
	"github.com/video-admin-api/models"
	"github.com/video-admin-api/utils/log"
)

func GetUsers() ([]models.User, error) {
	users := []models.User{}
	user := new(models.User)

	dbr := container.GetDbReader()
	row, err := dbr.Query("SELECT email,premium from users")

	if err != nil {
		switch err {
		case sql.ErrNoRows:
			log.Logger("info", fmt.Sprintf("No matching for SELECT query"))
		default:
			log.Logger("error", err)
			return []models.User{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while fetching from db"}
		}
	}

	for row.Next() {

		err := row.Scan(&user.Email, &user.Premium)

		if err != nil {
			log.Logger("error", err)
			return []models.User{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while scaning the row"}
		}
		users = append(users, *user)

	}

	return users, nil

}

func DelUsers(email string) error {

	dbw := container.GetDbWriter()
	_, err := dbw.Exec(fmt.Sprintf("delete from users where email='%s'", email))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting from db"}
	}
	_, err = dbw.Exec(fmt.Sprintf("delete from playlist where email='%s'", email))
	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting playlist from db"}
	}

	values := map[string]string{"email": email}
	json_data, err := json.Marshal(values)

	_, err = http.Post(fmt.Sprintf(os.Getenv("FE_CALLBACK_SERVER")+"/blockhim"), "application/json", bytes.NewBuffer(json_data))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, unable to callback blockhim"}
	}

	return nil
}

func BlockUsers(email string) error {

	dbw := container.GetDbWriter()

	_, err := dbw.Exec(fmt.Sprintf("update users set email='%s-BLOCKED' where email='%s'", email, email))
	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while blocking user, db err"}
	}

	values := map[string]string{"email": email}
	json_data, err := json.Marshal(values)

	_, err = http.Post(fmt.Sprintf(os.Getenv("FE_CALLBACK_SERVER")+"/blockhim"), "application/json", bytes.NewBuffer(json_data))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, unable to callback blockhim"}
	}

	return nil
}

func UnBlockUsers(email string) error {

	dbw := container.GetDbWriter()
	tm := strings.TrimSuffix(email, "-BLOCKED")
	_, err := dbw.Exec(fmt.Sprintf("update users set email='%s' where email='%s'", tm, email))
	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while unblocking user, db err"}
	}

	return nil
}

func UserPremiumToggle(email string) error {

	var p bool
	dbr := container.GetDbReader()
	dbw := container.GetDbWriter()
	row := dbr.QueryRow(fmt.Sprintf("SELECT premium from users where email='%s'", email))
	row.Scan(&p)
	p = !p

	_, err := dbw.Query(fmt.Sprintf("update users set premium=%t where email='%s'", p, email))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while toggling users premium, db err"}
	}

	values := map[string]models.User{"status": {Email: email, Premium: p}}
	json_data, err := json.Marshal(values)

	_, err = http.Post(fmt.Sprintf(os.Getenv("FE_CALLBACK_SERVER")+"/premium"), "application/json", bytes.NewBuffer(json_data))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, unable to callback premium"}
	}

	return nil

}
