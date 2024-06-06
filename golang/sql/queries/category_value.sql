-- name: CreateCategoryValue :one
INSERT INTO category_value (name, category_id) VALUES ($1, $2) RETURNING *;

-- name: UpdateCategoryValue :one
UPDATE category_value SET name = $1, category_id= $3, updated_at = NOW() WHERE id = $2  RETURNING *;

-- name: DeleteCategoryValueByIDs :exec
DELETE FROM category_value WHERE id = $1;

-- name: FindCategoryValueByIDs :one
SELECT category_value.id as id, 
category_value.name as name,  
category.id as category_id, 
category.name as category_name 
FROM category_value as  category_value 
    JOIN category as category 
    on category_value.category_id =  category.id 
WHERE  category_value.id = $1 LIMIT 1;

-- name: GetCategoryValues :maсвny
SELECT category_value.id as id, 
category_value.name as name,  
category.id as category_id, 
category.name as category_name 
FROM category_value 
    JOIN category as category 
    on category_value.category_id =  category.id 
ORDER BY category.id DESC;