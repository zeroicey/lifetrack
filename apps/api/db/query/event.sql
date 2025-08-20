-- name: GetAllEvents :many
SELECT 
    e.id,
    e.name,
    e.place,
    e.description,
    e.start_time,
    e.end_time,
    e.created_at,
    e.updated_at,
    er.id as reminder_id,
    er.remind_before,
    er.notified,
    er.created_at as reminder_created_at
FROM events e
LEFT JOIN event_reminders er ON e.id = er.event_id
ORDER BY e.start_time ASC, er.remind_before ASC;

-- name: GetEventByID :one
SELECT 
    e.id,
    e.name,
    e.place,
    e.description,
    e.start_time,
    e.end_time,
    e.created_at,
    e.updated_at,
    er.id as reminder_id,
    er.remind_before,
    er.notified,
    er.created_at as reminder_created_at
FROM events e
LEFT JOIN event_reminders er ON e.id = er.event_id
WHERE e.id = $1
ORDER BY er.remind_before ASC;

-- name: CreateEvent :one
INSERT INTO events (
    name,
    place,
    description,
    start_time,
    end_time
) VALUES (
    $1, $2, $3, $4, $5
)
RETURNING id, name, place, description, start_time, end_time, created_at, updated_at;

-- name: UpdateEvent :one
UPDATE events
SET 
    name = $2,
    place = $3,
    description = $4,
    start_time = $5,
    end_time = $6
WHERE id = $1
RETURNING id, name, place, description, start_time, end_time, created_at, updated_at;

-- name: DeleteEvent :exec
DELETE FROM events
WHERE id = $1;

-- name: GetEventsByDateRange :many
SELECT 
    e.id,
    e.name,
    e.place,
    e.description,
    e.start_time,
    e.end_time,
    e.created_at,
    e.updated_at,
    er.id as reminder_id,
    er.remind_before,
    er.notified,
    er.created_at as reminder_created_at
FROM events e
LEFT JOIN event_reminders er ON e.id = er.event_id
WHERE e.start_time >= $1 AND e.end_time <= $2
ORDER BY e.start_time ASC, er.remind_before ASC;

-- name: CreateEventReminder :one
INSERT INTO event_reminders (
    event_id,
    remind_before
) VALUES (
    $1, $2
)
RETURNING id, event_id, remind_before, notified, created_at;

-- name: UpdateEventReminderNotified :exec
UPDATE event_reminders
SET notified = $2
WHERE id = $1;

-- name: DeleteEventReminder :exec
DELETE FROM event_reminders
WHERE id = $1;

-- name: GetEventRemindersToNotify :many
SELECT 
    er.id,
    er.event_id,
    er.remind_before,
    er.notified,
    er.created_at,
    e.name,
    e.place,
    e.description,
    e.start_time,
    e.end_time
FROM event_reminders er
JOIN events e ON er.event_id = e.id
WHERE er.notified = false
    AND e.start_time <= NOW() + INTERVAL '1 minute' * er.remind_before
ORDER BY e.start_time ASC;

-- name: GetEventRemindersByEventID :many
SELECT 
    id,
    event_id,
    remind_before,
    notified,
    created_at
FROM event_reminders
WHERE event_id = $1
ORDER BY remind_before ASC;