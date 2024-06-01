-- name: CreateCategory :one
INSERT INTO category (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateCategory :one
UPDATE category SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteCategoryByIDs :exec
DELETE FROM category WHERE id = $1;

-- name: FindCategoryByIDs :one
SELECT id, name, created_at, updated_at FROM category WHERE  id = $1 LIMIT 1;

-- name: GetCategorys :many
SELECT * FROM category ORDER BY id DESC;