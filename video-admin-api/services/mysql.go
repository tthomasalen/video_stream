package services

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/video-admin-api/container"
	logger "github.com/video-admin-api/utils/log"
)

func MySQLInit() {
	//Initilaising Db
	sqlConnectionStringFormat := "%s:%s@tcp(%s:%s)/%s?parseTime=true"
	// sqlConnectionString := fmt.Sprintf(sqlConnectionStringFormat, "milen", "password",
	// 	"localhost", "3306", "meetups")

	sqlConnectionString := fmt.Sprintf(sqlConnectionStringFormat, os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"), os.Getenv("DB_NAME"))

	fmt.Println(sqlConnectionString)

	db, err := sql.Open("mysql", sqlConnectionString)
	if err != nil {
		logger.Logger("error", err)
		os.Exit(1)
	}

	err = db.Ping()
	if err != nil {
		logger.Logger("error", err)
		os.Exit(1)
	}
	container.SetDbReader(db)
	container.SetDbWriter(db)
}
