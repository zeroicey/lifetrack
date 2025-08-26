-- name: CreateHabit :one
INSERT INTO habits (name, description)
VALUES ($1, $2)
RETURNING *;

-- name: GetHabitById :one
SELECT * FROM habits WHERE id = $1;

-- name: GetHabitByName :one
SELECT * FROM habits WHERE name = $1;

-- name: GetAllHabits :many
SELECT * FROM habits ORDER BY updated_at DESC;

-- name: UpdateHabitById :one
UPDATE habits
SET
    name = $1,
    description = $2
WHERE
    id = $3
RETURNING *;

-- name: DeleteHabitById :exec
DELETE FROM habits
WHERE id = $1;

-- name: HabitExists :one
SELECT EXISTS(
    SELECT 1 FROM habits WHERE id = $1
) AS exists;

-- name: GetHabitStats :one
SELECT 
    h.id,
    h.name,
    h.description,
    h.created_at,
    h.updated_at,
    COUNT(hl.id) as total_logs,
    MAX(hl.happened_at)::timestamptz as last_log_time
FROM habits h
LEFT JOIN habit_logs hl ON h.id = hl.habit_id
WHERE h.id = $1
GROUP BY h.id, h.name, h.description, h.created_at, h.updated_at;