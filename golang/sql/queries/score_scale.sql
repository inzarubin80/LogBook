-- name: CreateScoreScale :one
INSERT INTO score_scale (place_from, place_to, numbers_of_points, sport_school_id, type_tournament_id, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;

-- name: UpdateScoreScale :one
UPDATE score_scale SET place_from = $2, place_to = $3, numbers_of_points = $4, sport_school_id = $5, type_tournament_id = $6, updated_at = NOW() WHERE id = $1  RETURNING *;

-- name: DeleteScoreScaleByIDs :exec
DELETE FROM score_scale WHERE id = $1;

-- name: FindScoreScaleByIDs :one
SELECT score_scale.id as id, 
score_scale.place_from as place_from,
score_scale.place_to as place_to,
score_scale.numbers_of_points as numbers_of_points,  
sport_school.id as sport_school_id, 
sport_school.name as sport_school_name,
type_tournament.id as type_tournament_id, 
type_tournament.name as type_tournament_name
FROM score_scale as  score_scale 
    JOIN sport_school as sport_school 
    on score_scale.sport_school_id =  sport_school.id 
    JOIN type_tournament as type_tournament 
    on score_scale.type_tournament_id =  type_tournament.id
WHERE  score_scale.id = $1 LIMIT 1;

-- name: GetScoreScales :many
SELECT score_scale.id as id, 
score_scale.place_from as place_from,
score_scale.place_to as place_to,
score_scale.numbers_of_points as numbers_of_points,  
sport_school.id as sport_school_id, 
sport_school.name as sport_school_name,
type_tournament.id as type_tournament_id, 
type_tournament.name as type_tournament_name 
FROM score_scale as score_scale 
    JOIN sport_school as sport_school 
    on score_scale.sport_school_id =  sport_school.id 
    JOIN type_tournament as type_tournament 
    on score_scale.type_tournament_id =  type_tournament.id 
ORDER BY sport_school.id DESC;