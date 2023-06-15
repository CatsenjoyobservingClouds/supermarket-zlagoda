package models

import "errors"

type ReceiptProduct struct {
	UPC          string  `json:"UPC" db:"upc"`
	ProductName  string  `json:"product_name" db:"product_name"`
	Amount       int     `json:"product_number" db:"product_number"`
	SellingPrice float64 `json:"selling_price" db:"selling_price"`
}

func (receiptProduct ReceiptProduct) VerifyCorrectness() error {
	if receiptProduct.UPC == "" {
		return errors.New("upc cannot be empty")
	}

	if receiptProduct.Amount < 0 || receiptProduct.SellingPrice < 0 {
		return errors.New("number parameters cannot be negative")
	}

	return nil
}
