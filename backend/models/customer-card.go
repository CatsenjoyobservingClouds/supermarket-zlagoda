package models

import (
	"database/sql"
	"errors"
)

type CustomerCard struct {
	CardNumber      string         `json:"card_number" db:"card_number"`
	LastName        string         `json:"cust_surname" db:"cust_surname"`
	FirstName       string         `json:"cust_name" db:"cust_name"`
	MiddleName      sql.NullString `json:"cust_patronymic" db:"cust_patronymic"`
	PhoneNumber     string         `json:"phone_number" db:"phone_number"`
	City            sql.NullString `json:"city" db:"city"`
	Street          sql.NullString `json:"street" db:"street"`
	ZipCode         sql.NullString `json:"zip_code" db:"zip_code"`
	DiscountPercent int            `json:"percent" db:"percent"`
}

func (card *CustomerCard) Verify() error {
	if card.DiscountPercent < 0 {
		return errors.New("discount cannot be less than 0")
	}

	return nil
}
