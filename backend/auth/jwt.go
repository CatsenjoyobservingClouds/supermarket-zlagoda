package auth

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"

	"Zlahoda_AIS/models"
)

var jwtKey = []byte("4t7w!z%C*F-JaNdRfUjXn2r5u8x/A?D(")

type JWTClaim struct {
	Username string      `json:"username"`
	Role     models.Role `json:"role"`
	jwt.StandardClaims
}

func GenerateJWT(username string, role models.Role) (tokenString string, err error) {
	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &JWTClaim{
		Username: username,
		Role:     role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(jwtKey)
}

func validateToken(signedToken string) (models.Role, error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		},
	)
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		err = errors.New("couldn't parse claims")

		return "", err
	}

	role := claims.Role

	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("token expired")

		return role, err
	}

	return role, nil
}
