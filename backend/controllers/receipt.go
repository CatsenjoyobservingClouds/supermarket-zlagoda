package controllers

import (
	"Zlahoda_AIS/models"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ReceiptRepository interface {
	CreateReceipt(employeeUsername string, receipt *models.Receipt) (*models.Receipt, error)
	GetAllReceipts(orderBy string, ascDesc string) ([]models.Receipt, error)
	GetAllProductsInReceipt(receiptNumber string, orderBy string, ascDesc string) ([]models.ReceiptProduct, error)
	GetReceiptByNumber(receiptNumber string) (*models.Receipt, error)
	DeleteReceiptByNumber(receiptNumber string) error
}

type ReceiptController struct {
	ReceiptRepository ReceiptRepository
}

type createReceiptRequest struct {
	CardNumber string                  `json:"card_number"`
	Products   []models.ReceiptProduct `json:"products"`
}

func (controller *ReceiptController) CreateReceipt(context *gin.Context) {
	var request createReceiptRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	employeeUsername := context.MustGet("username").(string)
	cardNumber := sql.NullString{String: request.CardNumber, Valid: request.CardNumber != ""}
	products := request.Products

	newReceipt, err := models.NewReceipt(cardNumber, products)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newReceipt, err = controller.ReceiptRepository.CreateReceipt(employeeUsername, newReceipt)
	if err != nil {
		context.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newReceipt)
}

func (controller *ReceiptController) GetAllReceipts(context *gin.Context) {
	receiptsOrderBy := context.DefaultQuery("orderBy", "print_date")
	receiptsAscDesc := context.DefaultQuery("ascDesc", "DESC")

	receipts, err := controller.ReceiptRepository.GetAllReceipts(receiptsOrderBy, receiptsAscDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, receipts)
}

func (controller *ReceiptController) GetReceipt(context *gin.Context) {
	receiptNumber := getReceiptNumber(context)
	productsOrderBy := context.DefaultQuery("orderBy", "UPC")
	productsAscDesc := context.DefaultQuery("ascDesc", "ASC")

	receipt, err := controller.ReceiptRepository.GetReceiptByNumber(receiptNumber)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	receiptProducts, err := controller.ReceiptRepository.GetAllProductsInReceipt(receipt.ReceiptNumber, productsOrderBy, productsAscDesc)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	receipt.Products = receiptProducts

	context.JSON(http.StatusOK, *receipt)
}

func (controller *ReceiptController) DeleteReceipt(context *gin.Context) {
	receiptNumber := getReceiptNumber(context)

	if err := controller.ReceiptRepository.DeleteReceiptByNumber(receiptNumber); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}

func getReceiptNumber(context *gin.Context) string {
	return context.Param("check_number")
}
