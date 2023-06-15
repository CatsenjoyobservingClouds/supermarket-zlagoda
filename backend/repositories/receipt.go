package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresReceiptRepository struct {
}

func (repo *PostgresReceiptRepository) CreateReceipt(employeeUsername string, receipt *models.Receipt) (*models.Receipt, error) {
	getEmployeeIdQuery := `SELECT id_employee FROM employee WHERE username = $1`
	if err := db.QueryRow(getEmployeeIdQuery, employeeUsername).Scan(&receipt.EmployeeID); err != nil {
		return nil, err
	}

	createReceiptQuery := `INSERT INTO "check" (id_employee, card_number) VALUES ($1, $2) RETURNING check_number`
	if err := db.QueryRow(createReceiptQuery, receipt.EmployeeID, receipt.CardNumber).Scan(&receipt.ReceiptNumber); err != nil {
		return nil, err
	}

	getProductSellingPriceQuery := `SELECT selling_price FROM "store_product" WHERE upc = '%v'`
	decrementProductInStoreAmountQuery := `UPDATE "store_product" SET products_number = products_number - $1 WHERE upc = $2`
	createReceiptProductQuery := `INSERT INTO "sale" (upc, check_number, product_number, selling_price) VALUES ($1, $2, $3, $4)`

	for i, product := range receipt.Products {
		err := db.Get(&receipt.Products[i].SellingPrice, fmt.Sprintf(getProductSellingPriceQuery, product.UPC))
		if err != nil {
			return nil, err
		}

		transaction := db.MustBegin()

		_, err = transaction.Exec(decrementProductInStoreAmountQuery, product.Amount, product.UPC)
		if err != nil {
			return nil, err
		}

		transaction.MustExec(createReceiptProductQuery, product.UPC, receipt.ReceiptNumber, product.Amount, product.SellingPrice)

		err = transaction.Commit()
		if err != nil {
			return nil, fmt.Errorf("failed to commit transaction: %w", err)
		}
	}

	getEmployeeFullNameQuery := `SELECT empl_surname, empl_name, empl_patronymic FROM "employee" WHERE id_employee = $1`
	if err := db.QueryRow(getEmployeeFullNameQuery, receipt.EmployeeID).Scan(
		&receipt.EmployeeLastName, &receipt.EmployeeFirstName, &receipt.EmployeeMiddleName,
	); err != nil {
		return nil, err
	}

	if !receipt.CardNumber.Valid {
		return receipt, nil
	}

	getCustomerFullNameQuery := `SELECT cust_surname, cust_name, cust_patronymic FROM "customer_card" WHERE card_number = $1`
	if err := db.QueryRow(getCustomerFullNameQuery, receipt.CardNumber).Scan(
		&receipt.CustomerLastName, &receipt.CustomerFirstName, &receipt.CustomerMiddleName,
	); err != nil {
		return nil, err
	}

	return receipt, nil
}

func (repo *PostgresReceiptRepository) GetAllReceipts(orderBy string, ascDesc string) ([]models.Receipt, error) {
	getAllReceiptsQuery :=
		`SELECT 
    		check_number, print_date, sum_total, vat,  
    		e.id_employee, empl_surname, empl_name, empl_patronymic,
    		cc.card_number, cust_surname, cust_name, cust_patronymic
		FROM "check" 
		    INNER JOIN employee e on e.id_employee = "check".id_employee
		    LEFT JOIN customer_card cc on "check".card_number = cc.card_number`
	getAllReceiptsSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllReceiptsQuery, orderBy, ascDesc)

	var receipts []models.Receipt
	err := db.Select(&receipts, getAllReceiptsSortedQuery)
	if err != nil {
		return nil, err
	}

	return receipts, nil
}

func (repo *PostgresReceiptRepository) GetAllProductsInReceipt(receiptNumber string, orderBy string, ascDesc string) ([]models.ReceiptProduct, error) {
	getAllReceiptProductsQuery :=
		`SELECT sp.upc, p.product_name, s.product_number, s.selling_price
		FROM "sale" s INNER JOIN store_product sp on sp.upc = s.upc INNER JOIN product p on p.id_product = sp.id_product
		WHERE check_number = $1`
	getAllReceiptProductsSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllReceiptProductsQuery, orderBy, ascDesc)

	var receiptProducts []models.ReceiptProduct
	err := db.Select(&receiptProducts, getAllReceiptProductsSortedQuery, receiptNumber)
	if err != nil {
		return nil, err
	}

	return receiptProducts, nil
}

func (repo *PostgresReceiptRepository) GetReceiptByNumber(receiptNumber string) (*models.Receipt, error) {
	getByNumberQuery :=
		`SELECT 
    		check_number, print_date, sum_total, vat,  
    		e.id_employee, empl_surname, empl_name, empl_patronymic,
    		cc.card_number, cust_surname, cust_name, cust_patronymic
		FROM "check" 
		    INNER JOIN employee e on e.id_employee = "check".id_employee
		    LEFT JOIN customer_card cc on "check".card_number = cc.card_number
        WHERE check_number = $1`

	var receipt models.Receipt
	err := db.Get(&receipt, getByNumberQuery, receiptNumber)
	if err != nil {
		return nil, err
	}

	return &receipt, nil
}

func (repo *PostgresReceiptRepository) DeleteReceiptByNumber(receiptNumber string) error {
	deleteByNumberQuery := `DELETE FROM "check" WHERE check_number = $1 RETURNING check_number;`

	return db.QueryRow(deleteByNumberQuery, receiptNumber).Scan(&receiptNumber)
}
