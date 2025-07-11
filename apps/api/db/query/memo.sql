-- name: ListMemosWithPagination :many
SELECT * FROM memos
ORDER BY created_at DESC;

-- name: GetMemoByID :one
SELECT * FROM memos
WHERE id = $1 LIMIT 1;

-- name: CreateMemo :one
INSERT INTO memos (
    content, attachments
) VALUES (
    $1, $2
)
RETURNING *;

-- name: DeleteMemoByID :exec
DELETE FROM memos
WHERE id = $1;