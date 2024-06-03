-- name: CreateTypeTournament :one
INSERT INTO type_tournament (name, created_at) VALUES ($1, NOW()) RETURNING *;

-- name: UpdateTypeTournament :one
UPDATE type_tournament SET name = $1,  updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteTypeTournamentByIDs :exec
DELETE FROM type_tournament WHERE id = $1;

-- name: FindTypeTournamentByIDs :one
SELECT id, name, created_at, updated_at FROM type_tournament WHERE  id = $1 LIMIT 1;

-- name: GetTypeTournaments :many
SELECT * FROM type_tournament ORDER BY id DESC;