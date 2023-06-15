package controllers

import (
	"Zlahoda_AIS/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type CategoryRepository interface {
	CreateCategory(category *models.Category) (*models.Category, error)
	GetAllCategories(orderBy string, ascDesc string) ([]models.Category, error)
	GetCategoryByNumber(categoryNumber int) (*models.Category, error)
	UpdateCategoryByNumber(category *models.Category) (*models.Category, error)
	DeleteCategoryByNumber(categoryNumber int) error
}

type CategoryController struct {
	CategoryRepository CategoryRepository
}

func Ping(context *gin.Context) {
	context.JSON(http.StatusOK, gin.H{"message": "pong"})
}

func (controller *CategoryController) CreateCategory(context *gin.Context) {
	var category models.Category
	if err := context.ShouldBindJSON(&category); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err := category.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newCategory, err := controller.CategoryRepository.CreateCategory(&category)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newCategory)
}

func (controller *CategoryController) GetCategory(context *gin.Context) {
	categoryNumber := getCategoryNumber(context)

	category, err := controller.CategoryRepository.GetCategoryByNumber(categoryNumber)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *category)
}

func (controller *CategoryController) GetAllCategories(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "category_name")
	ascDesc := context.DefaultQuery("ascDesc", "ASC")

	categories, err := controller.CategoryRepository.GetAllCategories(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, categories)
}

func (controller *CategoryController) UpdateCategory(context *gin.Context) {
	categoryNumber := getCategoryNumber(context)

	var category models.Category
	if err := context.ShouldBindJSON(&category); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	category.CategoryNumber = categoryNumber

	if err := category.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	updatedCategory, err := controller.CategoryRepository.UpdateCategoryByNumber(&category)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedCategory)
}

func (controller *CategoryController) DeleteCategory(context *gin.Context) {
	categoryNumber := getCategoryNumber(context)

	if err := controller.CategoryRepository.DeleteCategoryByNumber(categoryNumber); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}

func getCategoryNumber(context *gin.Context) int {
	categoryNumber, err := strconv.Atoi(context.Param("category_number"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "provided category number is not an int"})
		context.Abort()

		return -1
	}

	return categoryNumber
}
