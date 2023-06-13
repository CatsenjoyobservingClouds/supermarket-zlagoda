package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresProductInStoreRepository struct {
}

func (repo *PostgresProductInStoreRepository) CreateProductInStore(productInStore *models.ProductInStore) (*models.ProductInStore, error) {
	createProductInStoreQuery :=
		`INSERT INTO "store_product" (upc, upc_prom, id_product, selling_price, products_number, promotional_product) 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING *`

	var newProductInStore models.ProductInStore
	if err := db.QueryRowx(createProductInStoreQuery,
		productInStore.UPC, productInStore.UPCProm, productInStore.Product.ID,
		productInStore.SellingPrice, productInStore.ProductsNumber, productInStore.IsPromotional,
	).StructScan(&newProductInStore); err != nil {
		return nil, err
	}

	return &newProductInStore, nil
}

func (repo *PostgresProductInStoreRepository) GetAllProductsInStore(orderBy string, ascDesc string) ([]models.ProductInStore, error) {
	getAllQuery :=
		`SELECT * 
		FROM "store_product" 
		    INNER JOIN product p on p.id_product = store_product.id_product
		    INNER JOIN category c on c.category_number = p.category_number`
	getAllSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllQuery, orderBy, ascDesc)

	var productsInStore []models.ProductInStore
	err := db.Select(&productsInStore, getAllSortedQuery)
	if err != nil {
		return nil, err
	}

	return productsInStore, nil
}

func (repo *PostgresProductInStoreRepository) GetProductInStoreByUPC(productInStoreUPC string) (*models.ProductInStore, error) {
	getByUPCQuery :=
		`SELECT * 
		FROM "store_product" 
		    INNER JOIN product p on p.id_product = store_product.id_product
		    INNER JOIN category c on c.category_number = p.category_number
		WHERE upc = $1;`

	var productInStore models.ProductInStore
	err := db.QueryRowx(getByUPCQuery, productInStoreUPC).StructScan(&productInStore)
	if err != nil {
		return nil, err
	}

	return &productInStore, nil
}

func (repo *PostgresProductInStoreRepository) UpdateProductInStoreByUPC(UPC string, productInStore *models.ProductInStore) (*models.ProductInStore, error) {
	updateByUPCQuery :=
		`UPDATE "store_product" 
		SET upc = $1,
		    upc_prom = $2,
		    selling_price = $3,
		    products_number = $4,
		    promotional_product = $5
		WHERE upc = $6
		RETURNING *;`

	err := db.QueryRowx(updateByUPCQuery,
		productInStore.UPC, productInStore.UPCProm,
		productInStore.SellingPrice, productInStore.ProductsNumber, productInStore.IsPromotional,
		UPC,
	).StructScan(productInStore)
	if err != nil {
		return nil, err
	}

	return productInStore, nil
}

func (repo *PostgresProductInStoreRepository) DeleteProductInStoreByUPC(productInStoreUPC string) error {
	deleteByUPCQuery := `DELETE FROM "store_product" WHERE upc = $1;`

	return db.QueryRow(deleteByUPCQuery, productInStoreUPC).Scan(&productInStoreUPC)
}
