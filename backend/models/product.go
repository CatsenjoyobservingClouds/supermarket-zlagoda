package models

import "errors"

type Product struct {
	ID              int    `json:"id_product,omitempty" db:"id_product"`
	ProductName     string `json:"product_name" db:"product_name"`
	Characteristics string `json:"characteristics" db:"characteristics"`
	Category
}

func (product Product) VerifyCorrectness() error {
	stringParameters := []string{product.ProductName, product.Characteristics}
	for _, stringParameter := range stringParameters {
		if stringParameter == "" {
			return errors.New("cannot have empty strings")
		}
	}

	return nil
}
