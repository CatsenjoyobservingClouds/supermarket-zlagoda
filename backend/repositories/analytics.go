package repositories

import (
	"fmt"
	"time"

	"Zlahoda_AIS/models"
)

type PostgresAnalyticsRepository struct {
}

func (repo *PostgresAnalyticsRepository) GetSalesPerCashier(startDate, endDate time.Time) ([]models.CashierSales, error) {
	query :=
		`SELECT employee.id_employee, empl_surname,
    		CASE
    		    WHEN count(sum_total) = 0 THEN 0
    		    ELSE sum(sum_total)
    		END
    		AS sum_sold
		FROM employee LEFT JOIN "check" ON employee.id_employee = "check".id_employee
		WHERE empl_role = 'Cashier' AND ((print_date >= $1 AND print_date <= $2) OR check_number IS NULL)
		GROUP BY employee.id_employee, empl_surname
		ORDER BY sum_sold DESC`

	var sales []models.CashierSales
	err := db.Select(&sales, query, startDate, endDate)

	return sales, err
}

func (repo *PostgresAnalyticsRepository) GetSalesPerProduct(startDate, endDate time.Time) ([]models.ProductSales, error) {
	query :=
		`SELECT 
    		p.id_product, 
    		product_name,
    		coalesce(sum(s.product_number), 0) AS units_sold,
    		coalesce(sum(s.product_number * s.selling_price), 0) AS total_sales_price
		FROM product p
		    LEFT JOIN store_product sp on p.id_product = sp.id_product
			LEFT JOIN sale s on sp.upc = s.upc
			LEFT JOIN "check" c on c.check_number = s.check_number
		WHERE c.check_number IS NULL OR (print_date >= $1 AND print_date <= $2)
		GROUP BY p.id_product, product_name`

	var sales []models.ProductSales
	err := db.Select(&sales, query, startDate, endDate)

	return sales, err
}

func (repo *PostgresAnalyticsRepository) GetAveragePricePerCategory(decimalPlaces int, orderBy, ascDesc string) ([]models.CategoryAveragePrices, error) {
	// initialize the query
	query :=
		`SELECT category.category_number, category_name, coalesce(round(avg(selling_price), $1), 0) AS average_price
		FROM category 
		    LEFT JOIN product ON category.category_number = product.category_number
		    LEFT JOIN store_product ON product.id_product = store_product.id_product
		WHERE NOT promotional_product OR product.id_product IS NULL
		GROUP BY category.category_number, category_name`

	// format the query with sorting parameters
	queryOrdered := fmt.Sprintf("%s ORDER BY %s %s", query, orderBy, ascDesc)

	// execute the query, and save the results
	// into the averagePrices variable
	var averagePrices []models.CategoryAveragePrices
	err := db.Select(&averagePrices, queryOrdered, decimalPlaces)

	return averagePrices, err
}

func (repo *PostgresAnalyticsRepository) GetCategorySalesPerCashier(categoryNumber int) ([]models.CashierCategorySales, error) {
	query :=
		`SELECT e.id_employee, empl_surname, coalesce(sum(product_number), 0) as units_sold
		FROM employee e
			LEFT JOIN "check" c on e.id_employee = c.id_employee
			LEFT JOIN sale s on c.check_number = s.check_number
			LEFT JOIN store_product sp on sp.upc = s.upc
			LEFT JOIN product p on p.id_product = sp.id_product
		WHERE category_number = $1 OR category_number IS NULL
		GROUP BY e.id_employee, empl_surname
		ORDER BY units_sold DESC`

	var averagePrices []models.CashierCategorySales
	err := db.Select(&averagePrices, query, categoryNumber)

	return averagePrices, err
}

func (repo *PostgresAnalyticsRepository) GetRegisteredCustomersWhoHaveBeenServedByEveryCashier() ([]models.CustomerCard, error) {
	query :=
		`SELECT card_number, cust_surname, cust_name, cust_patronymic
		FROM customer_card
		WHERE NOT EXISTS (SELECT *
		                  FROM employee
		                  WHERE empl_role = 'Касир' AND NOT EXISTS (SELECT *
		                                                            FROM "check"
		                                                            WHERE "check".card_number = customer_card.card_number 
		                                                              AND "check".id_employee = employee.id_employee
		                                                            )
		                  );`

	var customers []models.CustomerCard
	err := db.Select(&customers, query)

	return customers, err
}

func (repo *PostgresAnalyticsRepository) GetCashiersWhoHaveSoldEveryProductInTheStore() ([]models.Employee, error) {
	query :=
		`SELECT employee.id_employee, empl_surname
		FROM employee
		WHERE NOT EXISTS (SELECT UPC
		                 FROM store_product
		                 WHERE UPC NOT IN (SELECT UPC
		                                  FROM sale LEFT JOIN "check"
		                                      		ON sale.check_number = "check".check_number
		                                  WHERE "check".id_employee = employee.id_employee
		                                  )
		                );`

	var cashiers []models.Employee
	err := db.Select(&cashiers, query)

	return cashiers, err
}
