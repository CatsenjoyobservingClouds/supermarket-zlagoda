package middleware

import (
	"Zlahoda_AIS/models"
	"github.com/gin-gonic/gin"
)

func EmployeeAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		err := validateTokenAndSavePayloadToContext(context)
		if err != nil {
			context.JSON(401, gin.H{"error": err.Error()})
			context.Abort()

			return
		}

		role := context.MustGet("role").(models.Role)
		if role != models.Manager && role != models.Cashier {
			context.JSON(401, gin.H{"error": "not a registered employee"})
			context.Abort()

			return
		}

		context.Next()
	}
}

func ManagerAuth() gin.HandlerFunc {
	return func(context *gin.Context) {
		err := validateTokenAndSavePayloadToContext(context)
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
		err := validateTokenAndSavePayloadToContext(context)
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

func validateTokenAndSavePayloadToContext(context *gin.Context) error {
	tokenString := context.GetHeader("Authorization")
	claims, err := validateTokenAndReturnClaims(tokenString)
	if err != nil {
		return err
	}

	context.Set("username", claims.Username)
	context.Set("role", claims.Role)

	return nil
}
