package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresProductRepository struct {
}

func (repo *PostgresProductRepository) CreateProduct(product *models.Product) (*models.Product, error) {
	createProductQuery :=
		`INSERT INTO "product" (category_number, product_name, characteristics) 
		VALUES ($1, $2, $3) 
		RETURNING id_product`

	var newId int
	if err := db.QueryRow(createProductQuery,
		product.CategoryNumber, product.ProductName, product.Characteristics,
	).Scan(&newId); err != nil {
		return nil, err
	}

	product.ID = newId

	return product, nil
}

func (repo *PostgresProductRepository) GetAllProducts(orderBy string, ascDesc string) ([]models.Product, error) {
	getAllQuery := `SELECT * FROM "product" INNER JOIN category c on c.category_number = product.category_number`
	getAllSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllQuery, orderBy, ascDesc)

	var products []models.Product
	err := db.Select(&products, getAllSortedQuery)
	if err != nil {
		return nil, err
	}

	return products, nil
}

func (repo *PostgresProductRepository) GetProductByID(productID int) (*models.Product, error) {
	getByIDQuery :=
		`SELECT * 
		FROM "product" INNER JOIN category c on c.category_number = product.category_number 
		WHERE id_product = $1;`

	var product models.Product
	err := db.Get(&product, getByIDQuery, productID)
	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (repo *PostgresProductRepository) UpdateProductByID(product *models.Product) (*models.Product, error) {
	updateByIDQuery :=
		`UPDATE "product" 
		SET category_number = $1, 
		    product_name = $2, 
		    characteristics = $3
		WHERE id_product = $4
		RETURNING *;`

	err := db.QueryRowx(updateByIDQuery,
		product.CategoryNumber, product.ProductName, product.Characteristics, product.ID,
	).StructScan(product)
	if err != nil {
		return nil, err
	}

	return product, nil
}

func (repo *PostgresProductRepository) DeleteProductByID(productID int) error {
	deleteByIDQuery := `DELETE FROM "product" WHERE id_product = $1;`

	_, err := db.Exec(deleteByIDQuery, productID)
	if err != nil {
		return err
	}

	return nil
}
