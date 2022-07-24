package controllers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/video-admin-api/container"
	"github.com/video-admin-api/models"
	"github.com/video-admin-api/utils/log"
)

func ListVideos() ([]models.VList, error) {
	var videos models.Video
	var vlists []models.VList
	dbr := container.GetDbReader()
	row, err := dbr.Query("SELECT id,title from videos")
	if err != nil {
		switch err {
		case sql.ErrNoRows:
			log.Logger("info", fmt.Sprintf("No matching for SELECT query"))
		default:
			log.Logger("error", err)
			return []models.VList{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while fetching from db"}
		}
	}

	for row.Next() {
		err := row.Scan(&videos.Id, &videos.Title)
		if err != nil {
			log.Logger("error", err)
			return []models.VList{}, models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while scaning the row"}
		}

		vlists = append(vlists, models.VList{Id: videos.Id, Title: videos.Title})
	}

	return vlists, nil

}

func DelVideos(id int) error {

	dbw := container.GetDbWriter()
	_, err := dbw.Exec(fmt.Sprintf("delete from videos where id=%d", id))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting videos from db"}
	}
	_, err = dbw.Exec(fmt.Sprintf("delete from playlist where id=%d", id))
	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting playlist from db"}
	}

	cmd1 := exec.Command("sh", "-c", "rm -f "+os.Getenv("ALBUMART_FOLDER")+fmt.Sprint(id)+".png")
	cmd2 := exec.Command("sh", "-c", "rm -f "+os.Getenv("VIDEOS_FOLDER")+fmt.Sprint(id))

	err = cmd1.Run()
	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting video from folder"}
	}
	err = cmd2.Run()

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while deleting album art"}
	}

	values := map[string]int{"id": id}
	json_data, err := json.Marshal(values)

	_, err = http.Post(fmt.Sprintf(os.Getenv("FE_CALLBACK_SERVER")+"/removesong"), "application/json", bytes.NewBuffer(json_data))

	if err != nil {
		return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, unable to callback remove video"}
	}

	return nil
}

func UploadVideos(form *multipart.Form, payload *models.Payload) error {
	files := form.File["file"]

	cur_time := time.Now().UnixMilli()
	dbw := container.GetDbWriter()

	for _, file := range files {
		// Source
		src, err := file.Open()
		if err != nil {
			return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while opening new file at src"}
		}
		defer src.Close()

		// Destination
		dst, err := os.Create(fmt.Sprintf(os.Getenv("VIDEOS_FOLDER") + fmt.Sprint(cur_time)))

		if err != nil {
			return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while creating new file ast dest"}
		}
		defer dst.Close()

		// Copy
		_, err = io.Copy(dst, src)
		if err != nil {
			return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while copying content"}
		} else {

			_, err = dbw.Exec(fmt.Sprintf("insert into videos (id,title,description,premium) values (%d,'%s','%s',%s)", cur_time, payload.Title, payload.Description, payload.Premium))
			if err != nil {
				return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while inserting db values to db"}
			}
		}

		// Taking album art

		//fmt.Println("sh", "-c", os.Getenv("FFMPEG_BINARY")+" -i "+os.Getenv("VIDEOS_FOLDER")+fmt.Sprint(cur_time)+" -vf 'select=eq(n\\,34)'  -vframes 1 "+os.Getenv("ALBUMART_FOLDER")+fmt.Sprint(cur_time))

		cmd := exec.Command("sh", "-c", fmt.Sprintf(os.Getenv("FFMPEG_BINARY")+" -i "+os.Getenv("VIDEOS_FOLDER")+fmt.Sprint(cur_time)+" -vf 'select=eq(n\\,34)'  -vframes 1 "+os.Getenv("ALBUMART_FOLDER")+fmt.Sprint(cur_time)+".png"))

		err = cmd.Run()

		if err != nil {
			return models.CustomError{Code: http.StatusInternalServerError, Message: "Error, while taking album art"}
		}

	}
	return nil
}
