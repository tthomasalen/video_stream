package models

type LoginReqBody struct {
	Email    string `json: "email"`
	Password string `json: "password"`
}

type Payload struct {
	Title       string
	Premium     string
	Description string
}
