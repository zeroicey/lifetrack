-- name: CreateAttachment :one
INSERT INTO attachments (
    object_key,
    cover_object_key,
    original_name,
    mime_type,
    md5,
    cover_md5,
    file_size,
    status
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, 'uploading'
) RETURNING *;

-- name: FindCompletedAttachmentByMD5 :one
SELECT * FROM attachments
WHERE md5 = $1 AND status = 'completed'
LIMIT 1;

-- name: UpdateAttachmentStatus :exec
UPDATE attachments
SET status = $1
WHERE id = $2;

-- name: GetCompletedAttachmentObjectKey :one
SELECT object_key FROM attachments
WHERE id = $1 AND status = 'completed';

-- name: GetCompletedAttachmentCoverObjectKey :one
SELECT cover_object_key FROM attachments
WHERE id = $1 AND status = 'completed';

-- name: GetAttachmentById :one
SELECT * FROM attachments
WHERE id = $1;