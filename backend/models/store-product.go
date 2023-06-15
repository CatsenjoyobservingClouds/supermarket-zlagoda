package models

import (
	"database/sql"
	"errors"
)

type ProductInStore struct {
	UPC            string         `json:"UPC" db:"upc"`
	UPCProm        sql.NullString `json:"UPC_prom" db:"upc_prom"`
	SellingPrice   float64        `json:"selling_price" db:"selling_price"`
	ProductsNumber int            `json:"products_number" db:"products_number"`
	IsPromotional  bool           `json:"promotional_product" db:"promotional_product"`
	Product
}

func (productInStore ProductInStore) VerifyCorrectness() error {
	if productInStore.UPC == "" {
		return errors.New("upc cannot be empty")
	}

	if productInStore.SellingPrice < 0 || productInStore.ProductsNumber < 0 {
		return errors.New("values cannot be less than 0")
	}

	return nil
}
