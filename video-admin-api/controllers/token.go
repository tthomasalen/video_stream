package controllers

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/video-admin-api/models"
)

func GenerateToken(fullName string) (string, error) {

	claims := &models.JwtClaim{
		FullName: fullName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().UTC().Add(time.Hour * 24).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	} else {
		return tokenString, nil
	}

}
