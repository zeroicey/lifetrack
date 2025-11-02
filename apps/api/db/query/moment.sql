-- name: ListMoments :many
SELECT * FROM moments
WHERE ($1::timestamp IS NULL OR created_at < $1::timestamp)
ORDER BY created_at DESC
LIMIT $2;

-- name: GetMomentByID :one
SELECT * FROM moments
WHERE id = $1 LIMIT 1;

-- name: CreateMoment :one
INSERT INTO moments
(content)
VALUES ($1)
RETURNING *;

-- name: DeleteMomentByID :exec
DELETE FROM moments
WHERE id = $1;

-- name: MomentExists :one
SELECT EXISTS(
    SELECT 1 FROM moments WHERE id = $1
) AS exists;

-- name: CreateMomentAttachment :one
INSERT INTO moment_attachments
(
    object_key,
    original_name,
    mime_type,
    file_size,
    md5
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;
