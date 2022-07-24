package models

import "github.com/golang-jwt/jwt"

type JwtClaim struct {
	FullName string
	jwt.StandardClaims
}
