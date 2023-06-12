package controllers

import (
	"Zlahoda_AIS/models"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

type ReceiptRepository interface {
	CreateReceipt(receipt *models.Receipt) (*models.Receipt, error)
	GetAllReceipts(orderBy string, ascDesc string) ([]models.Receipt, error)
	GetReceiptByNumber(receiptNumber string) (*models.Receipt, error)
	UpdateReceiptByNumber(receiptNumber string, receiptProducts []models.ReceiptProduct) (*models.Receipt, error)
	DeleteReceiptByNumber(receiptNumber string) error
}

type ReceiptController struct {
	ReceiptRepository  ReceiptRepository
	EmployeeRepository EmployeeRepository
}

type createReceiptRequest struct {
	CardNumber string                  `json:"cardNumber"`
	Products   []models.ReceiptProduct `json:"products"`
}

func (controller *ReceiptController) CreateReceipt(context *gin.Context) {
	var request createReceiptRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	employeeID := context.MustGet("ID").(string)
	cardNumber := sql.NullString{String: request.CardNumber, Valid: request.CardNumber != ""}
	products := request.Products

	newReceipt, err := models.NewReceipt(employeeID, cardNumber, products)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newReceipt, err = controller.ReceiptRepository.CreateReceipt(newReceipt)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newReceipt)
}

func (controller *ReceiptController) GetReceipt(context *gin.Context) {
	receiptNumber := getReceiptNumber(context)

	receipt, err := controller.ReceiptRepository.GetReceiptByNumber(receiptNumber)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *receipt)
}

func (controller *ReceiptController) GetAllReceipts(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "check_number")
	ascDesc := context.DefaultQuery("ascDesc", "DESC")

	categories, err := controller.ReceiptRepository.GetAllReceipts(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, categories)
}

func (controller *ReceiptController) UpdateReceipt(context *gin.Context) {
	receiptNumber := getReceiptNumber(context)

	var receiptProducts []models.ReceiptProduct
	if err := context.ShouldBindJSON(&receiptProducts); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	updatedReceipt, err := controller.ReceiptRepository.UpdateReceiptByNumber(receiptNumber, receiptProducts)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedReceipt)
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
