package models

import (
	"database/sql"
	"errors"
	"time"
)

type Receipt struct {
	ReceiptNumber string    `json:"check_number" db:"check_number"`
	PrintDate     time.Time `json:"print_date" db:"print_date"`
	TotalSum      float64   `json:"sum_total" db:"sum_total"`
	VAT           float64   `json:"vat" db:"vat"`

	EmployeeID         string         `json:"id_employee" db:"id_employee"`
	EmployeeLastName   string         `json:"empl_surname" db:"empl_surname"`
	EmployeeFirstName  string         `json:"empl_name" db:"empl_name"`
	EmployeeMiddleName sql.NullString `json:"empl_patronymic" db:"empl_patronymic"`

	CardNumber         sql.NullString `json:"card_number" db:"card_number"`
	CustomerLastName   string         `json:"cust_surname" db:"cust_surname"`
	CustomerFirstName  string         `json:"cust_name" db:"cust_name"`
	CustomerMiddleName sql.NullString `json:"cust_patronymic" db:"cust_patronymic"`

	Products []ReceiptProduct `json:"products,omitempty" db:"-"`
}

func NewReceipt(employeeID string, cardNumber sql.NullString, products []ReceiptProduct) (*Receipt, error) {
	if len(products) < 1 {
		return nil, errors.New("a receipt cannot have 0 products")
	}

	totalSum := 0.0
	for _, product := range products {
		totalSum += float64(product.Amount) * product.SellingPrice
	}

	return &Receipt{
		PrintDate:  time.Now(),
		TotalSum:   totalSum,
		VAT:        totalSum * 0.2,
		EmployeeID: employeeID,
		CardNumber: cardNumber,
		Products:   products,
	}, nil
}
