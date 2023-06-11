package models

type Category struct {
	CategoryNumber int    `json:"category_number" db:"category_number"`
	CategoryName   string `json:"category_name" db:"category_name"`
}
