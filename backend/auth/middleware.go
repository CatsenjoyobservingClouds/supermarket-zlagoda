package auth

import (
	"github.com/gin-gonic/gin"
	"strings"

	"Zlahoda_AIS/models"
)

func ManagerAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		if extractRole(context) != models.Manager {
			context.JSON(401, gin.H{"error": "not a manager"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func CashierAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		if extractRole(context) != models.Cashier {
			context.JSON(401, gin.H{"error": "not a cashier"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func extractRole(context *gin.Context) models.Role {
	tokenString := context.GetHeader("Authorization")
	if !strings.HasPrefix(tokenString, "Bearer ") {
		context.JSON(401, gin.H{"error": "request does not contain a bearer access token"})
		context.Abort()

		return ""
	}

	tokenString = tokenString[7:]

	role, err := validateToken(tokenString)
	if err != nil {
		context.JSON(401, gin.H{"error": err.Error()})
		context.Abort()

		return ""
	}

	return role
}
