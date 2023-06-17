package models

import "database/sql"

type CashierSales struct {
	CashierID     string         `json:"id_employee" db:"id_employee"`
	LastName      string         `json:"empl_surname" db:"empl_surname"`
	FirstName     sql.NullString `json:"empl_name" db:"empl_name"`
	MiddleName    string         `json:"empl_patronymic,omitempty" db:"empl_patronymic"`
	TotalSalesSum float64        `json:"sum_sold" db:"sum_sold"`
}

type ProductSales struct {
	ProductID       int     `json:"id_product,omitempty" db:"id_product"`
	ProductName     string  `json:"product_name" db:"product_name"`
	UnitsSold       int     `json:"units_sold" db:"units_sold"`
	TotalSalesPrice float64 `json:"total_sales_price" db:"total_sales_price"`
}

type CategoryAveragePrices struct {
	CategoryNumber int     `json:"category_number" db:"category_number"`
	CategoryName   string  `json:"category_name" db:"category_name"`
	AveragePrice   float64 `json:"average_price" db:"average_price"`
}

type CashierMostSoldProducts struct {
	CashierID   string `json:"id_employee" db:"id_employee"`
	LastName    string `json:"empl_surname" db:"empl_surname"`
	ProductID   int    `json:"id_product,omitempty" db:"id_product"`
	ProductName string `json:"product_name" db:"product_name"`
	UnitsSold   int    `json:"units_sold" db:"units_sold"`
}
