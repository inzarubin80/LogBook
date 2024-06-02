-- name: CreateFl_sport_school :one
INSERT INTO fl_sport_school (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateFl_sport_school :one
UPDATE fl_sport_school SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteFl_sport_schoolByIDs :exec
DELETE FROM fl_sport_school WHERE id = $1;

-- name: FindFl_sport_schoolByIDs :one
SELECT id, name, created_at, updated_at FROM fl_sport_school WHERE  id = $1 LIMIT 1;

-- name: GetFl_sport_schools :many
SELECT * FROM fl_sport_school ORDER BY id DESC;