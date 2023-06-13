package models

type Product struct {
	ID              int    `json:"id_product,omitempty" db:"id_product"`
	ProductName     string `json:"product_name" db:"product_name"`
	Characteristics string `json:"characteristics" db:"characteristics"`
	Category
}
