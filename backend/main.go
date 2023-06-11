package main

import (
	"Zlahoda_AIS/auth"
	"Zlahoda_AIS/controllers"
	"Zlahoda_AIS/repositories"
	"github.com/gin-gonic/gin"
)

var employeeController *controllers.EmployeeController
var categoryController *controllers.CategoryController
var customerCardController *controllers.CustomerCardController
var productController *controllers.ProductController

func main() {
	repositories.InitializeDB()

	employeeRepository := &repositories.PostgresEmployeeRepository{}
	categoryRepository := &repositories.PostgresCategoryRepository{}
	customerCardRepository := &repositories.PostgresCustomerCardRepository{}
	productRepository := &repositories.PostgresProductRepository{}

	employeeController = &controllers.EmployeeController{EmployeeRepository: employeeRepository}
	categoryController = &controllers.CategoryController{CategoryRepository: categoryRepository}
	customerCardController = &controllers.CustomerCardController{CustomerCardRepository: customerCardRepository}
	productController = &controllers.ProductController{ProductRepository: productRepository}

	router := initRouter()
	router.Run(":8080")

	repositories.CloseDB()
}

func initRouter() *gin.Engine {
	router := gin.Default()
	router.Use(controllers.CORSMiddleware())

	router.POST("/login", employeeController.LoginEmployee)

	managerGroup := router.Group("/manager")
	managerGroup.Use(auth.ManagerAuth())
	{
		employeeGroup := managerGroup.Group("/employee")
		{
			employeeGroup.POST("/", employeeController.RegisterEmployee)
			employeeGroup.GET("/", employeeController.GetAllEmployees)
			employeeGroup.GET("/:id_employee", employeeController.GetEmployeeById)
			employeeGroup.PATCH("/:id_employee", employeeController.UpdateEmployee)
			employeeGroup.DELETE("/:id_employee", employeeController.DeleteEmployee)
		}

		categoryGroup := managerGroup.Group("/category")
		{
			categoryGroup.POST("/", categoryController.CreateCategory)
			categoryGroup.GET("/", categoryController.GetAllCategories)
			categoryGroup.GET("/:category_number", categoryController.GetCategory)
			categoryGroup.PATCH("/:category_number", categoryController.UpdateCategory)
			categoryGroup.DELETE("/:category_number", categoryController.DeleteCategory)
		}

		customerCardGroup := managerGroup.Group("/customerCard")
		{
			customerCardGroup.POST("/", customerCardController.CreateCustomerCard)
			customerCardGroup.GET("/", customerCardController.GetAllCustomerCards)
			customerCardGroup.GET("/:card_number", customerCardController.GetCustomerCard)
			customerCardGroup.PATCH("/:card_number", customerCardController.UpdateCustomerCard)
			customerCardGroup.DELETE("/:card_number", customerCardController.DeleteCustomerCard)
		}

		productGroup := managerGroup.Group("/product")
		{
			productGroup.POST("/", productController.CreateProduct)
			productGroup.GET("/", productController.GetAllProducts)
			productGroup.GET("/:id_product", productController.GetProduct)
			productGroup.PATCH("/:id_product", productController.UpdateProduct)
			productGroup.DELETE("/:id_product", productController.DeleteProduct)
		}

		managerGroup.GET("/ping", controllers.Ping)
	}

	//cashierGroup := router.Group("/cashier").Use(auth.CashierAuth())
	//{
	//
	//}

	return router
}
