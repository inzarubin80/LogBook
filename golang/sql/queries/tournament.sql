-- name: CreateTournament :one
INSERT INTO tournament (name, begin_date_tournament, end_date_tournament, type_of_tornament_id, venue, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;

-- name: UpdateTournament :one
UPDATE tournament SET name = $2, begin_date_tournament = $3, end_date_tournament = $4, type_of_tornament_id = $5, venue = $6, updated_at = NOW() WHERE id = $1  RETURNING *;

-- name: DeleteTournamentByIDs :exec
DELETE FROM tournament WHERE id = $1;

-- name: FindTournamentByIDs :one
SELECT tournament.id as id, 
tournament.name as name,
tournament.begin_date_tournament as begin_date_tournament,
tournament.end_date_tournament as end_date_tournament, 
tournament.venue as venue, 
type_tournament.id as type_of_tornament_id, 
type_tournament.name as type_of_tornament_name
FROM tournament as  tournament 
    JOIN type_tournament as type_tournament 
    on tournament.type_of_tornament_id =  type_tournament.id 
WHERE  tournament.id = $1 LIMIT 1;

-- name: GetTournaments :many
SELECT tournament.id as id, 
tournament.name as name,
tournament.begin_date_tournament as begin_date_tournament,
tournament.end_date_tournament as end_date_tournament, 
tournament.venue as venue, 
type_tournament.id as type_of_tornament_id, 
type_tournament.name as type_of_tornament_name
FROM tournament as  tournament 
    JOIN type_tournament as type_tournament 
    on tournament.type_of_tornament_id =  type_tournament.id 
ORDER BY tournament.name DESC;