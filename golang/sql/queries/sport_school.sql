-- name: CreateSportSchool :one
INSERT INTO sport_school (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateSportSchool :one
UPDATE sport_school SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteSportSchoolByIDs :exec
DELETE FROM sport_school WHERE id = $1;

-- name: FindSportSchoolByIDs :one
SELECT id, name, created_at, updated_at FROM sport_school WHERE  id = $1 LIMIT 1;

-- name: GetSportSchools :many
SELECT * FROM sport_school ORDER BY id DESC;