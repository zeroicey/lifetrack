-- name: CreateHabitLog :one
INSERT INTO habit_logs (habit_id, happened_at)
VALUES ($1, $2)
RETURNING *;

-- name: CreateHabitLogNow :one
INSERT INTO habit_logs (habit_id)
VALUES ($1)
RETURNING *;

-- name: GetHabitLogById :one
SELECT hl.*, h.name as habit_name 
FROM habit_logs hl
JOIN habits h ON hl.habit_id = h.id
WHERE hl.id = $1;

-- name: GetHabitLogsByHabitId :many
SELECT hl.*, h.name as habit_name 
FROM habit_logs hl
JOIN habits h ON hl.habit_id = h.id
WHERE hl.habit_id = $1
ORDER BY hl.happened_at DESC;

-- name: GetHabitLogsByHabitIdWithLimit :many
SELECT * FROM habit_logs
WHERE habit_id = $1
ORDER BY happened_at DESC
LIMIT $2;

-- name: GetHabitLogsCountByHabitId :one
SELECT COUNT(*) as count FROM habit_logs
WHERE habit_id = $1;

-- name: GetHabitLogsCountByHabitIdInDateRange :one
SELECT COUNT(*) as count FROM habit_logs
WHERE habit_id = $1
  AND happened_at >= $2
  AND happened_at <= $3;

-- name: GetAllHabitLogs :many
SELECT hl.*, h.name as habit_name 
FROM habit_logs hl
JOIN habits h ON hl.habit_id = h.id
ORDER BY hl.happened_at DESC;

-- name: DeleteHabitLogById :exec
DELETE FROM habit_logs
WHERE id = $1;

-- name: DeleteHabitLogsByHabitId :exec
DELETE FROM habit_logs
WHERE habit_id = $1;

-- name: UpdateHabitLogById :one
UPDATE habit_logs
SET happened_at = $2
WHERE id = $1
RETURNING *;

-- name: HabitLogExists :one
SELECT EXISTS(
    SELECT 1 FROM habit_logs WHERE id = $1
) AS exists;

-- 获取习惯及其最近的日志记录
-- name: GetHabitWithRecentLogs :many
SELECT 
    h.id as habit_id,
    h.name as habit_name,
    h.description as habit_description,
    h.created_at as habit_created_at,
    h.updated_at as habit_updated_at,
    hl.id as log_id,
    hl.happened_at as log_happened_at
FROM habits h
LEFT JOIN habit_logs hl ON h.id = hl.habit_id
WHERE h.id = $1
ORDER BY hl.happened_at DESC
LIMIT $2;

-- 获取今天的习惯日志
-- name: GetTodayHabitLogs :many
SELECT * FROM habit_logs
WHERE DATE(happened_at) = CURRENT_DATE
ORDER BY happened_at DESC;

-- 获取指定日期的习惯日志
-- name: GetHabitLogsByDate :many
SELECT * FROM habit_logs
WHERE DATE(happened_at) = $1
ORDER BY happened_at DESC;

-- 获取指定习惯在指定日期的日志
-- name: GetHabitLogsByHabitIdAndDate :many
SELECT * FROM habit_logs
WHERE habit_id = $1 AND DATE(happened_at) = $2
ORDER BY happened_at DESC;