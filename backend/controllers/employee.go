package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"Zlahoda_AIS/middleware"
	"Zlahoda_AIS/models"
)

type EmployeeRepository interface {
	VerifyUsernameNotUsed(username string) error
	CreateEmployee(employee *models.Employee) (*models.Employee, error)
	GetEmployeeByUsername(username string) (*models.Employee, error)
	GetAllEmployees(orderBy string, ascDesc string) ([]models.Employee, error)
	GetEmployeeById(id string) (*models.Employee, error)
	UpdateEmployeeById(employee *models.Employee) (*models.Employee, error)
	UpdateEmployeeCredentialsById(employee *models.Employee) error
	DeleteEmployeeById(id string) error
}

type EmployeeController struct {
	EmployeeRepository EmployeeRepository
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (controller *EmployeeController) RegisterEmployee(context *gin.Context) {
	var employee models.Employee
	if err := context.ShouldBindJSON(&employee); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err := employee.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err := controller.EmployeeRepository.VerifyUsernameNotUsed(employee.Username); err != nil {
		context.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err := employee.HashAndSavePassword(employee.Password); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	newEmployee, err := controller.EmployeeRepository.CreateEmployee(&employee)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusCreated, *newEmployee)
}

func (controller *EmployeeController) LoginEmployee(context *gin.Context) {
	var request LoginRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	employee, err := controller.EmployeeRepository.GetEmployeeByUsername(request.Username)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	credentialError := employee.CheckPassword(request.Password)
	if credentialError != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		context.Abort()

		return
	}

	tokenString, err := middleware.GenerateJWT(employee.Username, employee.Role)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func (controller *EmployeeController) GetAllEmployees(context *gin.Context) {
	orderBy := context.DefaultQuery("orderBy", "empl_surname")
	ascDesc := context.DefaultQuery("ascDesc", "ASC")

	employees, err := controller.EmployeeRepository.GetAllEmployees(orderBy, ascDesc)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, employees)
}

func (controller *EmployeeController) GetEmployeeById(context *gin.Context) {
	id := context.Param("id_employee")

	employee, err := controller.EmployeeRepository.GetEmployeeById(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *employee)
}

func (controller *EmployeeController) UpdateEmployee(context *gin.Context) {
	id := context.Param("id_employee")

	var employee models.Employee
	if err := context.ShouldBindJSON(&employee); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	employee.ID = id

	if err := employee.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	updatedEmployee, err := controller.EmployeeRepository.UpdateEmployeeById(&employee)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *updatedEmployee)
}

func (controller *EmployeeController) DeleteEmployee(context *gin.Context) {
	id := context.Param("id_employee")

	employeeToDelete, err := controller.EmployeeRepository.GetEmployeeById(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	employeeExecutingQueryUsername := context.MustGet("username").(string)
	if employeeToDelete.Username == employeeExecutingQueryUsername {
		context.JSON(http.StatusForbidden, gin.H{"error": "cannot delete oneself"})
		context.Abort()

		return
	}

	if err = controller.EmployeeRepository.DeleteEmployeeById(id); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, "deleted")
}
