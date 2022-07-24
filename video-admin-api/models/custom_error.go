package models

import "fmt"

type CustomError struct {
	Code    int
	Message string
}

func (c CustomError) Error() string {
	return fmt.Sprintf("Code %d, Message %s", c.Code, c.Message)
}
