package models

type Admins struct {
	Id       int    `json: "id"`
	FullName string `json: "full_name"`
	Email    string `json: "email"`
	Password string `json: "password"`
}
