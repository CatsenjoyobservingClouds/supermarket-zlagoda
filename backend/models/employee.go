package models

import (
	"database/sql"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type Employee struct {
	ID                string         `json:"id_employee,omitempty" db:"id_employee"`
	LastName          string         `json:"empl_surname" db:"empl_surname"`
	FirstName         string         `json:"empl_name" db:"empl_name"`
	MiddleName        sql.NullString `json:"empl_patronymic,omitempty" db:"empl_patronymic"`
	Role              Role           `json:"empl_role" db:"empl_role"`
	Salary            float64        `json:"salary" db:"salary"`
	BirthDate         time.Time      `json:"date_of_birth" db:"date_of_birth"`
	StartDate         time.Time      `json:"date_of_start" db:"date_of_start"`
	PhoneNumber       string         `json:"phone_number" db:"phone_number"`
	City              string         `json:"city" db:"city"`
	Street            string         `json:"street" db:"street"`
	ZipCode           string         `json:"zip_code" db:"zip_code"`
	Username          string         `json:"username" db:"username"`
	Password          string         `json:"password,omitempty" db:"password"`
	IsPasswordDefault bool           `json:"is_password_default,omitempty" db:"is_password_default"`
}

func (employee *Employee) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	employee.Password = string(bytes)

	return nil
}

func (employee *Employee) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(employee.Password), []byte(providedPassword))
	if err != nil {
		return err
	}

	return nil
}
