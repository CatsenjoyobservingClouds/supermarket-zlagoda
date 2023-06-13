package controllers

import (
	"Zlahoda_AIS/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ProductInStoreRepository interface {
	CreateProductInStore(productInStore *models.ProductInStore) (*models.ProductInStore, error)
	GetAllProductsInStore(orderBy string, ascDesc string) ([]models.ProductInStore, error)
	GetProductInStoreByUPC(UPC string) (*models.ProductInStore, error)
	UpdateProductInStoreByUPC(UPC string, productInStore *models.ProductInStore) (*models.ProductInStore, error)
	DeleteProductInStoreByUPC(UPC string) error
}

type ProductInStoreController struct {
	ProductInStoreRepository ProductInStoreRepository
}

func (controller *ProductInStoreController) CreateProductInStore(context *gin.Context) {
	var productInStore models.ProductInStore
	if err := context.ShouldBindJSON(&productInStore); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if productInStore.UPCProm.Valid {
		productInStore.IsPromotional = true
	}

	newProductInStore, err := controller.ProductInStoreRepository.CreateProductInStore(&productInStore)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newProductInStore)
}

func (controller *ProductInStoreController) GetProductInStore(context *gin.Context) {
	UPC := getProductInStoreUPC(context)

	productInStore, err := controller.ProductInStoreRepository.GetProductInStoreByUPC(UPC)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *productInStore)
}

func (controller *ProductInStoreController) GetAllProductInStores(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "products_number")
	ascDesc := context.DefaultQuery("ascDesc", "ASC")

	productInStores, err := controller.ProductInStoreRepository.GetAllProductsInStore(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, productInStores)
}

func (controller *ProductInStoreController) UpdateProductInStore(context *gin.Context) {
	UPC := getProductInStoreUPC(context)

	var productInStore models.ProductInStore
	if err := context.ShouldBindJSON(&productInStore); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if productInStore.UPCProm.Valid {
		productInStore.IsPromotional = true
	}

	updatedProductInStore, err := controller.ProductInStoreRepository.UpdateProductInStoreByUPC(UPC, &productInStore)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedProductInStore)
}

func (controller *ProductInStoreController) DeleteProductInStore(context *gin.Context) {
	UPC := getProductInStoreUPC(context)

	if err := controller.ProductInStoreRepository.DeleteProductInStoreByUPC(UPC); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}

func getProductInStoreUPC(context *gin.Context) string {
	return context.Param("UPC")
}
