-- name: CreateSportSchool :one
INSERT INTO sportSchool (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateSportSchool :one
UPDATE sportSchool SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteSportSchoolByIDs :exec
DELETE FROM sportSchool WHERE id = $1;

-- name: FindSportSchoolByIDs :one
SELECT id, name, created_at, updated_at FROM sportSchool WHERE  id = $1 LIMIT 1;

-- name: GetSportSchools :many
SELECT * FROM sportSchool ORDER BY id DESC;