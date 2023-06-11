package repositories

import (
	"Zlahoda_AIS/models"
	"fmt"
)

type PostgresCategoryRepository struct {
}

func (repo *PostgresCategoryRepository) CreateCategory(category *models.Category) (*models.Category, error) {
	createCategoryQuery := `INSERT INTO "category" (category_name) VALUES ($1) RETURNING category_number`

	var newId int
	if err := db.QueryRow(createCategoryQuery, category.CategoryName).Scan(&newId); err != nil {
		return nil, err
	}

	category.CategoryNumber = newId

	return category, nil
}

func (repo *PostgresCategoryRepository) GetAllCategories(orderBy string, ascDesc string) ([]models.Category, error) {
	getAllQuery := `SELECT * FROM category`
	getAllSortedQuery := fmt.Sprintf("%v ORDER BY %s %s", getAllQuery, orderBy, ascDesc)

	var categories []models.Category
	err := db.Select(&categories, getAllSortedQuery)
	if err != nil {
		return nil, err
	}

	return categories, nil
}

func (repo *PostgresCategoryRepository) GetCategoryByNumber(categoryNumber int) (*models.Category, error) {
	getByNumberQuery := `SELECT * FROM category WHERE category_number = $1;`

	var category models.Category
	err := db.Get(&category, getByNumberQuery, categoryNumber)
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (repo *PostgresCategoryRepository) UpdateCategoryByNumber(category *models.Category) (*models.Category, error) {
	updateByNumberQuery :=
		`UPDATE category SET category_name = $1 WHERE category_number = $2 RETURNING *;`

	err := db.QueryRowx(updateByNumberQuery, category.CategoryName, category.CategoryNumber).StructScan(category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (repo *PostgresCategoryRepository) DeleteCategoryByNumber(categoryNumber int) error {
	deleteByNumberQuery := `DELETE FROM category WHERE category_number = $1;`

	_, err := db.Exec(deleteByNumberQuery, categoryNumber)
	if err != nil {
		return err
	}

	return nil
}
