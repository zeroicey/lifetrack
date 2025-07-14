-- name: GetAllTaskGroups :many
SELECT * FROM task_groups ORDER BY name ASC;

-- name: GetTaskGroupById :one
SELECT * FROM task_groups WHERE id = $1;

-- name: GetTasksByGroupId :many
SELECT * FROM tasks WHERE group_id = $1 ORDER BY pos;

-- name: CreateTaskGroup :one
INSERT INTO task_groups (name, description)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateTaskGroup :one
UPDATE task_groups
SET
    name = $1,
    description = $2
WHERE
    id = $3
RETURNING *;

-- name: DeleteTaskGroup :exec
DELETE FROM task_groups
WHERE id = $1;
