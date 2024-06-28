-- name: CreateCoache :one
INSERT INTO coache (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateCoache :one
UPDATE coache SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteCoacheByIDs :exec
DELETE FROM coache WHERE id = $1;

-- name: FindCoacheByIDs :one
SELECT id, name, created_at, updated_at FROM coache WHERE  id = $1 LIMIT 1;

-- name: GetCoaches :many
SELECT * FROM coache Where name ILIKE  $1 OR $1 = '%%*%%' ORDER BY id DESC;