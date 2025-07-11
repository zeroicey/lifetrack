-- name: ListMemosWithCursor :many
SELECT * FROM memos
WHERE ($1::timestamp IS NULL OR created_at < $1::timestamp)
ORDER BY created_at DESC
LIMIT $2;


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