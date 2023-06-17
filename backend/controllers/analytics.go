package controllers

import (
	"Zlahoda_AIS/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type AnalyticsRepository interface {
	GetSalesPerCashier(startDate, endDate time.Time) ([]models.CashierSales, error)
	GetSalesPerProduct(startDate, endDate time.Time) ([]models.ProductSales, error)
	GetAveragePricePerCategory() ([]models.CategoryAveragePrices, error)
	GetMostSoldProductsPerCashier() ([]models.CashierMostSoldProducts, error)
	GetRegisteredCustomersWhoHaveBeenServedByEveryCashier() ([]models.CustomerCard, error)
	GetCashiersWhoHaveSoldEveryProductInTheStore() ([]models.Employee, error)
}

type AnalyticsController struct {
	AnalyticsRepository AnalyticsRepository
}

func (controller *AnalyticsController) GetSalesPerCashier(context *gin.Context) {
	startDate, endDate := getStartAndEndDates(context)

	sales, err := controller.AnalyticsRepository.GetSalesPerCashier(startDate, endDate)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, sales)
}

func (controller *AnalyticsController) GetSalesPerProduct(context *gin.Context) {
	startDate, endDate := getStartAndEndDates(context)

	sales, err := controller.AnalyticsRepository.GetSalesPerProduct(startDate, endDate)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, sales)
}

func (controller *AnalyticsController) GetAveragePricePerCategory(context *gin.Context) {
	averagePrices, err := controller.AnalyticsRepository.GetAveragePricePerCategory()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, averagePrices)
}

func (controller *AnalyticsController) GetMostSoldProductsPerCashier(context *gin.Context) {
	mostSoldProducts, err := controller.AnalyticsRepository.GetMostSoldProductsPerCashier()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, mostSoldProducts)
}

func (controller *AnalyticsController) GetRegisteredCustomersWhoHaveBeenServedByEveryCashier(context *gin.Context) {
	customers, err := controller.AnalyticsRepository.GetRegisteredCustomersWhoHaveBeenServedByEveryCashier()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, customers)
}

func (controller *AnalyticsController) GetCashiersWhoHaveSoldEveryProductInTheStore(context *gin.Context) {
	cashiers, err := controller.AnalyticsRepository.GetCashiersWhoHaveSoldEveryProductInTheStore()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, cashiers)
}

func getStartAndEndDates(context *gin.Context) (time.Time, time.Time) {
	startDateString := context.Query("start_date")
	endDateString := context.Query("end_date")

	startDate, err := time.Parse("02-01-2006", startDateString)
	if err != nil {
		startDate = time.Time{}
	}

	endDate, err := time.Parse("02-01-2006", endDateString)
	if err != nil {
		endDate = time.Now()
	}

	return startDate, endDate
}
