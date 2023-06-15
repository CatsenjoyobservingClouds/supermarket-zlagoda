package middleware

import (
	"Zlahoda_AIS/models"
	"github.com/gin-gonic/gin"
)

func ManagerAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		err := savePayloadToContext(context)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()

			return
		}

		if context.MustGet("role").(models.Role) != models.Manager {
			context.JSON(401, gin.H{"error": "not a manager"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func CashierAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		err := savePayloadToContext(context)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()

			return
		}

		if context.MustGet("role").(models.Role) != models.Cashier {
			context.JSON(401, gin.H{"error": "not a manager"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func savePayloadToContext(context *gin.Context) error {
	tokenString := context.GetHeader("Authorization")
	claims, err := validateTokenAndReturnClaims(tokenString)
	if err != nil {
		return err
	}

	context.Set("username", claims.Username)
	context.Set("role", claims.Role)

	return nil
}
