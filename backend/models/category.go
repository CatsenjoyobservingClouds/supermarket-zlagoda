package models

import "errors"

type Category struct {
	CategoryNumber int    `json:"category_number" db:"category_number"`
	CategoryName   string `json:"category_name" db:"category_name"`
}

func (category Category) VerifyCorrectness() error {
	if category.CategoryName == "" {
		return errors.New("category name cannot be empty")
	}

	return nil
}
