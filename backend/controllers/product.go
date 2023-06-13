package controllers

import (
	"Zlahoda_AIS/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ProductRepository interface {
	CreateProduct(product *models.Product) (*models.Product, error)
	GetAllProducts(orderBy string, ascDesc string) ([]models.Product, error)
	GetProductByID(productID int) (*models.Product, error)
	UpdateProductByID(product *models.Product) (*models.Product, error)
	DeleteProductByID(productID int) error
}

type ProductController struct {
	ProductRepository ProductRepository
}

func (controller *ProductController) CreateProduct(context *gin.Context) {
	var product models.Product
	if err := context.ShouldBindJSON(&product); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newProduct, err := controller.ProductRepository.CreateProduct(&product)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newProduct)
}

func (controller *ProductController) GetProduct(context *gin.Context) {
	productID := getProductID(context)

	product, err := controller.ProductRepository.GetProductByID(productID)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *product)
}

func (controller *ProductController) GetAllProducts(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "product_name")
	ascDesc := context.DefaultQuery("ascDesc", "ASC")

	products, err := controller.ProductRepository.GetAllProducts(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, products)
}

func (controller *ProductController) UpdateProduct(context *gin.Context) {
	productID := getProductID(context)

	var product models.Product
	if err := context.ShouldBindJSON(&product); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	product.ID = productID

	updatedProduct, err := controller.ProductRepository.UpdateProductByID(&product)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedProduct)
}

func (controller *ProductController) DeleteProduct(context *gin.Context) {
	productID := getProductID(context)

	if err := controller.ProductRepository.DeleteProductByID(productID); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}

func getProductID(context *gin.Context) int {
	productID, err := strconv.Atoi(context.Param("id_product"))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "provided product id is not an int"})
		context.Abort()

		return -1
	}

	return productID
}
