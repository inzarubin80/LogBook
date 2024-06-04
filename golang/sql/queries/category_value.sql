-- name: CreateCategoryValue :one
INSERT INTO category_value (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateCategoryValue :one
UPDATE category_value SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteCategoryValueByIDs :exec
DELETE FROM category_value WHERE id = $1;

-- name: FindCategoryValueByIDs :one
SELECT id, name, created_at, updated_at FROM category_value WHERE  id = $1 LIMIT 1;

-- name: GetCategoryValues :many
SELECT * FROM category_value ORDER BY id DESC;