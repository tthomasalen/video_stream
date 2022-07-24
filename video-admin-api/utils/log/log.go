package log

import (
	"fmt"
	"log"
	"os"
)

var (
	err           error
	WarningLogger *log.Logger
	InfoLogger    *log.Logger
	ErrorLogger   *log.Logger
)

type LogUnit struct {
	FilePtr      *os.File
	AccessLogPtr *os.File
}

func (l *LogUnit) Loginit() {
	l.FilePtr, err = os.OpenFile(os.Getenv("LOG_LOCATION"), os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	l.AccessLogPtr, err = os.OpenFile(os.Getenv("ACCESS_LOG_LOCATION"), os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println(err)
	}
	log.SetOutput(l.FilePtr)
	InfoLogger = log.New(l.FilePtr, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	WarningLogger = log.New(l.FilePtr, "WARNING: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(l.FilePtr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)

}

func Logger(s string, e interface{}) {
	switch s {
	case "info":
		InfoLogger.Println(e)
	case "error":
		ErrorLogger.Println(e)
	case "warn":
		WarningLogger.Println(e)
	}

}
