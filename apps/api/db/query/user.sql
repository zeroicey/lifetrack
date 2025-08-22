-- name: CheckUserExists :one
SELECT COUNT(*) > 0 as exists FROM users;

-- name: GetUser :one
SELECT * FROM users LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (email, name, password_hash, birthday, avatar_base64, bio)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET
    email = $2,
    name = $3,
    birthday = $4,
    avatar_base64 = $5,
    bio = $6
WHERE
    id = $1
RETURNING *;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2
WHERE id = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;

-- name: GetUserCount :one
SELECT COUNT(*) as count FROM users;