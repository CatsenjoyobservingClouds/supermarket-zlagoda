package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Ping(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{"message": "pong"})
}

func GetCategory(context *gin.Context) {

}

func GetAllCategories(context *gin.Context) {

}

func CreateCategory(context *gin.Context) {

}

func UpdateCategory(context *gin.Context) {

}

func DeleteCategory(context *gin.Context) {

}
