package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresCustomerCardRepository struct {
}

func (repo *PostgresCustomerCardRepository) CreateCustomerCard(customerCard *models.CustomerCard) (*models.CustomerCard, error) {
	createQuery :=
		`INSERT INTO customer_card (cust_surname, cust_name, cust_patronymic, phone_number, city, street, zip_code, percent) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING card_number`

	var newCustomerCardNumber string
	if err := db.QueryRow(createQuery,
		customerCard.LastName, customerCard.FirstName, customerCard.MiddleName,
		customerCard.PhoneNumber, customerCard.City, customerCard.Street, customerCard.ZipCode,
		customerCard.DiscountPercent,
	).Scan(&newCustomerCardNumber); err != nil {
		return nil, err
	}

	customerCard.CardNumber = newCustomerCardNumber

	return customerCard, nil
}

func (repo *PostgresCustomerCardRepository) GetAllCustomerCards(orderBy string, ascDesc string) ([]models.CustomerCard, error) {
	getAllQuery := `SELECT * FROM customer_card`
	getAllSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllQuery, orderBy, ascDesc)

	var customerCards []models.CustomerCard
	err := db.Select(&customerCards, getAllSortedQuery)
	if err != nil {
		return nil, err
	}

	return customerCards, nil
}

func (repo *PostgresCustomerCardRepository) GetCustomerCardByNumber(cardNumber string) (*models.CustomerCard, error) {
	getByNumberQuery := `SELECT * FROM customer_card WHERE card_number = $1`

	var customerCard models.CustomerCard
	err := db.Get(&customerCard, getByNumberQuery, cardNumber)
	if err != nil {
		return nil, err
	}

	return &customerCard, nil
}

func (repo *PostgresCustomerCardRepository) UpdateCustomerCardByNumber(customerCard *models.CustomerCard) (*models.CustomerCard, error) {
	updateByNumberQuery :=
		`UPDATE customer_card 
		SET cust_surname = $1,
		    cust_name = $2, 
		    cust_patronymic = $3,
		    phone_number = $4,
		    city = $5,
		    street = $6,
		    zip_code = $7,
		    percent = $8
		WHERE card_number = $9 
		RETURNING *`

	err := db.QueryRowx(
		updateByNumberQuery,
		customerCard.LastName, customerCard.FirstName, customerCard.MiddleName,
		customerCard.PhoneNumber, customerCard.City, customerCard.Street, customerCard.ZipCode,
		customerCard.DiscountPercent, customerCard.CardNumber,
	).StructScan(customerCard)
	if err != nil {
		return nil, err
	}

	return customerCard, nil
}

func (repo *PostgresCustomerCardRepository) DeleteCustomerCardByNumber(cardNumber string) error {
	deleteByNumberQuery := `DELETE FROM customer_card WHERE card_number = $1;`

	_, err := db.Exec(deleteByNumberQuery, cardNumber)
	if err != nil {
		return err
	}

	return nil
}
