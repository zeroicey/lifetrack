-- name: GetAllTaskGroups :many
SELECT * FROM task_groups ORDER BY name ASC;

-- name: GetTaskGroupById :one
SELECT * FROM task_groups WHERE id = $1;

-- name: CreateTaskGroup :one
INSERT INTO task_groups (name, description)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateTaskGroupById :one
UPDATE task_groups
SET
    name = $1,
    description = $2
WHERE
    id = $3
RETURNING *;

-- name: DeleteTaskGroupById :exec
DELETE FROM task_groups
WHERE id = $1;

-- name: TaskGroupExists :one
SELECT EXISTS(
    SELECT 1 FROM task_groups WHERE id = $1
) AS exists;
