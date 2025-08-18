-- name: CreateAttachment :one
-- 创建一个新的附件记录，并返回新创建的完整记录
INSERT INTO attachments (
    object_key,
    original_name,
    mime_type,
    md5,
    file_size,
    status
) VALUES (
    $1, $2, $3, $4, $5, 'uploading'
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