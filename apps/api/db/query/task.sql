-- name: GetTasksByGroupId :many
SELECT * FROM tasks WHERE group_id = $1 ORDER BY pos;

-- name: GetTaskById :one
SELECT * FROM tasks WHERE id = $1;

-- name: CreateTask :one
INSERT INTO tasks (group_id, pos, content, description, deadline)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: UpdateTaskById :one
UPDATE tasks
SET
    pos = $2,
    content = $3,
    description = $4,
    deadline = $5
WHERE
    id = $1
RETURNING *;

-- name: DeleteTaskById :exec
DELETE FROM tasks
WHERE id = $1;

-- name: TaskExists :one
SELECT EXISTS(
    SELECT 1 FROM tasks WHERE id = $1
) AS exists;
