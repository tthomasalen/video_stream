package models

type Video struct {
	Id          int    `json: "id"`
	Title       string `json: "title"`
	Premium     bool   `json: "premium"`
	Description string `json: "description"`
}

type VList struct {
	Id    int
	Title string
}
