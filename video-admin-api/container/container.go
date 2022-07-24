package container

import (
	"database/sql"
	"sync"

	_ "github.com/go-sql-driver/mysql"
)

var (
	dbReaderOnce, dbWriterOnce       sync.Once
	dbConnection, dbReader, dbWriter *sql.DB
)

func SetDbReader(dbCon *sql.DB) {
	dbReaderOnce.Do(func() {
		dbReader = dbCon
	})
}

func GetDbReader() *sql.DB {
	return dbReader
}

func SetDbWriter(dbCon *sql.DB) {
	dbWriterOnce.Do(func() {
		dbWriter = dbCon
	})
}

func GetDbWriter() *sql.DB {
	return dbWriter
}
