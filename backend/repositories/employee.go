package repositories

import (
	"errors"
	"fmt"

	"Zlahoda_AIS/models"
)

type PostgresEmployeeRepository struct {
}

func (repo *PostgresEmployeeRepository) VerifyUsernameNotUsed(username string) error {
	countUsersWithGivenUsernameQuery := `SELECT COUNT(*) FROM "employee" WHERE username = $1;`

	var count int
	if err := db.Get(&count, countUsersWithGivenUsernameQuery, username); err != nil {
		return err
	}

	if count != 0 {
		return errors.New("username already exists")
	}

	return nil
}

func (repo *PostgresEmployeeRepository) CreateEmployee(employee *models.Employee) (*models.Employee, error) {
	createEmployeeQuery := `INSERT INTO "employee" 
    (empl_surname, empl_name, empl_patronymic, empl_role, salary, date_of_birth, date_of_start, phone_number, city, street, zip_code, username, password) 
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_employee;`

	var newId string
	err := db.QueryRow(createEmployeeQuery,
		employee.LastName, employee.FirstName, employee.MiddleName, employee.Role, employee.Salary, employee.BirthDate,
		employee.StartDate, employee.PhoneNumber, employee.City, employee.Street, employee.ZipCode, employee.Username,
		employee.Password).Scan(&newId)
	if err != nil {
		return nil, err
	}

	employee.ID = fmt.Sprintf("empl_%s", newId)

	return employee, nil
}

func (repo *PostgresEmployeeRepository) GetEmployeeByUsername(username string) (*models.Employee, error) {
	getEmployeeByUsernameQuery := `SELECT * FROM employee WHERE username = $1`

	var employee models.Employee
	err := db.Get(&employee, getEmployeeByUsernameQuery, username)
	if err != nil {
		return nil, err
	}

	return &employee, nil
}

func (repo *PostgresEmployeeRepository) GetAllEmployees() ([]models.Employee, error) {
	getAllEmployeesQuery := `SELECT * FROM employee ORDER BY empl_surname;`

	var employees []models.Employee
	err := db.Select(&employees, getAllEmployeesQuery)
	if err != nil {
		return nil, err
	}

	return employees, nil
}

func (repo *PostgresEmployeeRepository) GetEmployeeById(id string) (*models.Employee, error) {
	getEmployeeByIdQuery := `SELECT * FROM employee WHERE id_employee = $1;`

	var employee models.Employee
	err := db.Get(&employee, getEmployeeByIdQuery, id)
	if err != nil {
		return nil, err
	}

	return &employee, nil
}

func (repo *PostgresEmployeeRepository) UpdateEmployeeById(employee *models.Employee) (*models.Employee, error) {
	updateEmployeeByIdQuery :=
		`UPDATE employee SET
		empl_surname = $1,
		empl_name = $2,
		empl_patronymic = $3,
		empl_role = $4,
		salary = $5,
		date_of_birth = $6,
		date_of_start = $7,
		phone_number = $8,
		city = $9,
		street = $10,
		zip_code = $11
		WHERE id_employee = $12
		RETURNING *;`

	err := db.QueryRowx(updateEmployeeByIdQuery,
		employee.LastName, employee.FirstName, employee.MiddleName, employee.Role, employee.Salary, employee.BirthDate,
		employee.StartDate, employee.PhoneNumber, employee.City, employee.Street, employee.ZipCode, employee.ID).StructScan(employee)
	if err != nil {
		return nil, err
	}

	return employee, nil
}

func (repo *PostgresEmployeeRepository) DeleteEmployeeById(id string) error {
	deleteEmployeeByIdQuery := `DELETE FROM employee WHERE id_employee = $1;`

	_, err := db.Exec(deleteEmployeeByIdQuery, id)
	if err != nil {
		return err
	}

	return nil
}
