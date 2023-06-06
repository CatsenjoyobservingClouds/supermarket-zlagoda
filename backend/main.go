package main

import (
	"Zlahoda_AIS/auth"
	"Zlahoda_AIS/controllers"
	"Zlahoda_AIS/repositories"
	"github.com/gin-gonic/gin"
)

var employeeController *controllers.EmployeeController

func main() {
	repositories.InitializeDB()

	employeeRepository := &repositories.PostgresEmployeeRepository{}
	employeeController = &controllers.EmployeeController{EmployeeRepository: employeeRepository}

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

		managerGroup.GET("/ping", controllers.Ping)
	}

	//cashierGroup := router.Group("/cashier").Use(auth.CashierAuth())
	//{
	//
	//}

	return router
}
