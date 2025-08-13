-- name: CreateTaskGroup :one
INSERT INTO task_groups (name, description, type)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetTaskGroupById :one
SELECT * FROM task_groups WHERE id = $1;

-- name: GetTaskGroupByName :one
SELECT * FROM task_groups WHERE name = $1;

-- name: GetAllTaskGroups :many
SELECT * FROM task_groups ORDER BY updated_at DESC;

-- name: GetTaskGroupsByType :many
SELECT * FROM task_groups WHERE type = $1 ORDER BY updated_at DESC;

-- name: UpdateTaskGroupById :one
UPDATE task_groups
SET
    name = $1,
    description = $2,
    type = $3
WHERE
    id = $4
RETURNING *;

-- name: DeleteTaskGroupById :exec
DELETE FROM task_groups
WHERE id = $1;

-- name: TaskGroupExists :one
SELECT EXISTS(
    SELECT 1 FROM task_groups WHERE id = $1
) AS exists;

