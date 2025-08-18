-- name: GetMomentsPaginated :many
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

-- name: AddAttachmentToMoment :exec
INSERT INTO moment_attachments (moment_id, attachment_id, position)
VALUES ($1, $2, $3);

-- name: RemoveAttachmentFromMoment :exec
DELETE FROM moment_attachments
WHERE moment_id = $1 AND attachment_id = $2;

-- name: GetMomentAttachmentsByID :many
SELECT 
    a.*,
    ma.position
FROM attachments a
INNER JOIN moment_attachments ma ON a.id = ma.attachment_id
WHERE ma.moment_id = $1 AND a.status = 'completed'
ORDER BY ma.position;

-- name: DeleteMomentByID :exec
DELETE FROM moments
WHERE id = $1;

-- name: MomentExists :one
SELECT EXISTS(
    SELECT 1 FROM moments WHERE id = $1
) AS exists;
