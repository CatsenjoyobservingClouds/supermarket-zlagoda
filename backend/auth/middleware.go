package auth

import (
	"github.com/gin-gonic/gin"

	"Zlahoda_AIS/models"
)

func ManagerAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.JSON(401, gin.H{"error": "request does not contain an access token"})
			context.Abort()

			return
		}

		role, err := validateToken(tokenString)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()

			return
		}

		if role != models.Manager {
			context.JSON(401, gin.H{"error": "not a manager"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func CashierAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString := context.GetHeader("Authorization")
		if tokenString == "" {
			context.JSON(401, gin.H{"error": "request does not contain an access token"})
			context.Abort()

			return
		}

		role, err := validateToken(tokenString)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()

			return
		}

		if role != models.Cashier {
			context.JSON(401, gin.H{"error": "not a cashier"})
			context.Abort()

			return
		}

		context.Next()
	}
}
