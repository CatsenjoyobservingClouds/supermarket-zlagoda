package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresReceiptRepository struct {
}

func (repo *PostgresReceiptRepository) CreateReceipt(receipt *models.Receipt) (*models.Receipt, error) {
	createReceiptQuery := `INSERT INTO "check" (id_employee, card_number) VALUES ($1, $2) RETURNING check_number`

	var newReceiptNumber string
	if err := db.QueryRow(createReceiptQuery, receipt.EmployeeID, receipt.CardNumber).Scan(&newReceiptNumber); err != nil {
		return nil, err
	}

	createReceiptProductQuery := `INSERT INTO "sale" (upc, check_number, product_number, selling_price) VALUES ($1, $2, $3, $4)`

	for _, product := range receipt.Products {
		db.MustExec(createReceiptProductQuery, product.UPC, receipt.ReceiptNumber, product.Amount, product.SellingPrice)
	}

	receipt.ReceiptNumber = newReceiptNumber

	getEmployeeFullNameQuery := `SELECT empl_surname, empl_name, empl_role FROM "employee" WHERE id_employee = $1`
	if err := db.QueryRow(getEmployeeFullNameQuery, receipt.EmployeeID).Scan(
		&receipt.EmployeeLastName, &receipt.EmployeeFirstName, &receipt.EmployeeMiddleName,
	); err != nil {
		return nil, err
	}

	if !receipt.CardNumber.Valid {
		return receipt, nil
	}

	return receipt, nil
}

func (repo *PostgresReceiptRepository) GetAllReceipts(orderBy string, ascDesc string) ([]models.Receipt, error) {
	getAllQuery := `SELECT * FROM "check"`
	getAllSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllQuery, orderBy, ascDesc)

	var receipts []models.Receipt
	err := db.Select(&receipts, getAllSortedQuery)
	if err != nil {
		return nil, err
	}

	return receipts, nil
}

func (repo *PostgresReceiptRepository) GetReceiptByNumber(receiptNumber int) (*models.Receipt, error) {
	getByNumberQuery := `SELECT * FROM receipt WHERE receipt_number = $1;`

	var receipt models.Receipt
	err := db.Get(&receipt, getByNumberQuery, receiptNumber)
	if err != nil {
		return nil, err
	}

	return &receipt, nil
}

func (repo *PostgresReceiptRepository) UpdateReceiptByNumber(receipt *models.Receipt) (*models.Receipt, error) {
	updateByNumberQuery :=
		`UPDATE receipt SET receipt_name = $1 WHERE receipt_number = $2 RETURNING *;`

	err := db.QueryRowx(updateByNumberQuery, receipt.ReceiptName, receipt.ReceiptNumber).StructScan(receipt)
	if err != nil {
		return nil, err
	}

	return receipt, nil
}

func (repo *PostgresReceiptRepository) DeleteReceiptByNumber(receiptNumber int) error {
	deleteByNumberQuery := `DELETE FROM receipt WHERE receipt_number = $1;`

	_, err := db.Exec(deleteByNumberQuery, receiptNumber)
	if err != nil {
		return err
	}

	return nil
}
