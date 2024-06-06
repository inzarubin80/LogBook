// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: category_value.sql

package db

import (
	"context"
)

const createCategoryValue = `-- name: CreateCategoryValue :one
INSERT INTO category_value (name, category_id) VALUES ($1, $2) RETURNING id, name, category_id, created_at, updated_at
`

type CreateCategoryValueParams struct {
	Name       string `json:"name"`
	CategoryID int64  `json:"category_id"`
}

func (q *Queries) CreateCategoryValue(ctx context.Context, arg CreateCategoryValueParams) (CategoryValue, error) {
	row := q.db.QueryRow(ctx, createCategoryValue, arg.Name, arg.CategoryID)
	var i CategoryValue
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CategoryID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const deleteCategoryValueByIDs = `-- name: DeleteCategoryValueByIDs :exec
DELETE FROM category_value WHERE id = $1
`

func (q *Queries) DeleteCategoryValueByIDs(ctx context.Context, id int64) error {
	_, err := q.db.Exec(ctx, deleteCategoryValueByIDs, id)
	return err
}

const findCategoryValueByIDs = `-- name: FindCategoryValueByIDs :one
SELECT category_value.id as id, 
category_value.name as name,  
category.id as category_id, 
category.name as category_name 
FROM category_value as  category_value 
    JOIN category as category 
    on category_value.category_id =  category.id 
WHERE  category_value.id = $1 LIMIT 1
`

type FindCategoryValueByIDsRow struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	CategoryID   int64  `json:"category_id"`
	CategoryName string `json:"category_name"`
}

func (q *Queries) FindCategoryValueByIDs(ctx context.Context, id int64) (FindCategoryValueByIDsRow, error) {
	row := q.db.QueryRow(ctx, findCategoryValueByIDs, id)
	var i FindCategoryValueByIDsRow
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CategoryID,
		&i.CategoryName,
	)
	return i, err
}

const getCategoryValues = `-- name: GetCategoryValues :many
SELECT category_value.id as id, 
category_value.name as name,  
category.id as category_id, 
category.name as category_name 
FROM category_value 
    JOIN category as category 
    on category_value.category_id =  category.id 
ORDER BY category.id DESC
`

type GetCategoryValuesRow struct {
	ID           int64  `json:"id"`
	Name         string `json:"name"`
	CategoryID   int64  `json:"category_id"`
	CategoryName string `json:"category_name"`
}

func (q *Queries) GetCategoryValues(ctx context.Context) ([]GetCategoryValuesRow, error) {
	rows, err := q.db.Query(ctx, getCategoryValues)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []GetCategoryValuesRow{}
	for rows.Next() {
		var i GetCategoryValuesRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.CategoryID,
			&i.CategoryName,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateCategoryValue = `-- name: UpdateCategoryValue :one
UPDATE category_value SET name = $1, category_id= $3, updated_at = NOW() WHERE id = $2  RETURNING id, name, category_id, created_at, updated_at
`

type UpdateCategoryValueParams struct {
	Name       string `json:"name"`
	ID         int64  `json:"id"`
	CategoryID int64  `json:"category_id"`
}

func (q *Queries) UpdateCategoryValue(ctx context.Context, arg UpdateCategoryValueParams) (CategoryValue, error) {
	row := q.db.QueryRow(ctx, updateCategoryValue, arg.Name, arg.ID, arg.CategoryID)
	var i CategoryValue
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.CategoryID,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}
