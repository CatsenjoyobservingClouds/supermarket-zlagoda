package middleware

import (
	"errors"
	"strings"
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

func validateTokenAndReturnClaims(signedToken string) (*JWTClaim, error) {
	if !strings.HasPrefix(signedToken, "Bearer ") {
		return nil, errors.New("request does not contain a bearer access token")
	}

	signedToken = signedToken[7:]

	token, err := jwt.ParseWithClaims(
		signedToken,
		&JWTClaim{},
		func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		},
	)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JWTClaim)
	if !ok {
		return nil, errors.New("couldn't parse claims")
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		return nil, errors.New("token expired")
	}

	return claims, nil
}
