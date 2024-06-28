-- name: CreateSportsman :one
INSERT INTO sportsman (name, gender, date_birth, main_coache_id, sport_school_id, insuranse, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *;

-- name: UpdateSportsman :one
UPDATE sportsman SET name = $2, gender = $3, date_birth = $4, main_coache_id = $5, sport_school_id = $6, insuranse = $7, updated_at = NOW() WHERE id = $1  RETURNING *;

-- name: DeleteSportsmanByIDs :exec
DELETE FROM sportsman WHERE id = $1;

-- name: FindSportsmanByIDs :one
SELECT sportsman.id as id, 
sportsman.name as name,
sportsman.gender as gender,
sportsman.date_birth as date_birth, 
sportsman.insuranse as insuranse, 
coache.id as main_coache_id, 
coache.name as main_coache_name, 
sport_school.id as sport_school_id, 
sport_school.name as tsport_school_name
FROM sportsman as  sportsman 
    JOIN sport_school as sport_school 
    on sportsman.sport_school_id =  sport_school.id 
    JOIN coache as coache 
    on sportsman.main_coache_id =  coache.id
WHERE  sportsman.id = $1 LIMIT 1;

-- name: GetSportsmans :many
SELECT sportsman.id as id, 
sportsman.name as name,
sportsman.gender as gender,
sportsman.date_birth as date_birth, 
sportsman.insuranse as insuranse, 
coache.id as main_coache_id, 
coache.name as main_coache_name, 
sport_school.id as sport_school_id, 
sport_school.name as tsport_school_name
FROM sportsman as  sportsman 
    JOIN sport_school as sport_school 
    on sportsman.sport_school_id =  sport_school.id 
    JOIN coache as coache 
    on sportsman.main_coache_id =  coache.id
ORDER BY sportsman.name DESC;