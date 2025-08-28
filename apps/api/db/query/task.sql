-- name: GetTasksByGroupId :many
SELECT * FROM tasks
WHERE group_id = $1
ORDER BY
    CASE WHEN deadline IS NULL THEN 1 ELSE 0 END,
    CASE WHEN deadline < NOW() THEN 0 ELSE 1 END,
    deadline ASC;


-- name: GetTaskById :one
SELECT * FROM tasks WHERE id = $1;

-- name: CreateTask :one
INSERT INTO tasks (group_id, content, deadline)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateTaskById :one
UPDATE tasks
SET
    content = $2,
    deadline = $3,
    status = $4
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
