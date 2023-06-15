package controllers

import (
	"Zlahoda_AIS/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CustomerCardRepository interface {
	CreateCustomerCard(customerCard *models.CustomerCard) (*models.CustomerCard, error)
	GetAllCustomerCards(orderBy string, ascDesc string) ([]models.CustomerCard, error)
	GetCustomerCardByNumber(cardNumber string) (*models.CustomerCard, error)
	UpdateCustomerCardByNumber(customerCard *models.CustomerCard) (*models.CustomerCard, error)
	DeleteCustomerCardByNumber(cardNumber string) error
}

type CustomerCardController struct {
	CustomerCardRepository CustomerCardRepository
}

func (controller *CustomerCardController) CreateCustomerCard(context *gin.Context) {
	var customerCard models.CustomerCard
	if err := context.ShouldBindJSON(&customerCard); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err := customerCard.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newCustomerCard, err := controller.CustomerCardRepository.CreateCustomerCard(&customerCard)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newCustomerCard)
}

func (controller *CustomerCardController) GetCustomerCard(context *gin.Context) {
	customerCardNumber := context.Param("card_number")

	customerCard, err := controller.CustomerCardRepository.GetCustomerCardByNumber(customerCardNumber)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *customerCard)
}

func (controller *CustomerCardController) GetAllCustomerCards(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "cust_surname")
	ascDesc := context.DefaultQuery("ascDesc", "ASC")

	categories, err := controller.CustomerCardRepository.GetAllCustomerCards(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, categories)
}

func (controller *CustomerCardController) UpdateCustomerCard(context *gin.Context) {
	customerCardNumber := context.Param("card_number")

	var customerCard models.CustomerCard
	if err := context.ShouldBindJSON(&customerCard); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	customerCard.CardNumber = customerCardNumber

	if err := customerCard.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	updatedCustomerCard, err := controller.CustomerCardRepository.UpdateCustomerCardByNumber(&customerCard)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedCustomerCard)
}

func (controller *CustomerCardController) DeleteCustomerCard(context *gin.Context) {
	customerCardNumber := context.Param("card_number")

	if err := controller.CustomerCardRepository.DeleteCustomerCardByNumber(customerCardNumber); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}
