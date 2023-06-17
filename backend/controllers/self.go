package controllers

import (
	"Zlahoda_AIS/middleware"
	"Zlahoda_AIS/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

type SelfController struct {
	EmployeeRepository EmployeeRepository
}

func (controller *SelfController) GetAllInfoAboutOneself(context *gin.Context) {
	username := context.MustGet("username").(string)

	employee, err := controller.EmployeeRepository.GetEmployeeByUsername(username)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, *employee)
}

func (controller *SelfController) UpdateInfoAboutOneself(context *gin.Context) {
	username := context.MustGet("username").(string)

	employee, err := controller.EmployeeRepository.GetEmployeeByUsername(username)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	var requestedUpdatedEmployee models.Employee
	if err = context.ShouldBindJSON(&requestedUpdatedEmployee); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	requestedUpdatedEmployee.ID = employee.ID
	requestedUpdatedEmployee.Role = employee.Role
	requestedUpdatedEmployee.Salary = employee.Salary
	requestedUpdatedEmployee.StartDate = employee.StartDate
	requestedUpdatedEmployee.Username = employee.Username
	requestedUpdatedEmployee.Password = employee.Password

	if err = employee.VerifyCorrectness(); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	updatedEmployee, err := controller.EmployeeRepository.UpdateEmployeeById(&requestedUpdatedEmployee)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	context.JSON(http.StatusOK, updatedEmployee)
}

type updateCredentialsRequest struct {
	OldPassword string `json:"oldPassword"`
	NewUsername string `json:"newUsername"`
	NewPassword string `json:"newPassword"`
}

func (controller *SelfController) UpdateCredentials(context *gin.Context) {
	oldUsername := context.MustGet("username").(string)

	employee, err := controller.EmployeeRepository.GetEmployeeByUsername(oldUsername)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	var request updateCredentialsRequest
	if err = context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err = employee.CheckPassword(request.OldPassword); err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password!"})
		context.Abort()

		return
	}

	if request.NewUsername == "" {
		request.NewUsername = oldUsername
	} else if err = controller.EmployeeRepository.VerifyUsernameNotUsed(request.NewUsername); err != nil && request.NewUsername != oldUsername {
		context.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		context.Abort()

		return
	} else {
		employee.Username = request.NewUsername
	}

	if request.NewPassword == "" {
		request.NewPassword = employee.Password
	} else if err = employee.HashAndSavePassword(request.NewPassword); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		context.Abort()

		return
	}

	if err = controller.EmployeeRepository.UpdateEmployeeCredentialsById(employee); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
