package models

type Product struct {
	ID              int    `json:"id_product,omitempty" db:"id_product"`
	CategoryNumber  int    `json:"category_number" db:"category_number"`
	CategoryName    string `json:"category_name,omitempty" db:"category_name"`
	ProductName     string `json:"product_name" db:"product_name"`
	Characteristics string `json:"characteristics" db:"characteristics"`
}
