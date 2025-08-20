package types

import "time"

type EventResponse struct {
	ID          int64             `json:"id"`
	Content     string            `json:"content"`
	Place       string            `json:"place"`
	Description string            `json:"description"`
	StartTime   time.Time         `json:"start_time"`
	EndTime     time.Time         `json:"end_time"`
	Reminders   []EventReminder   `json:"reminders"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
}

type EventReminder struct {
	ID           int64     `json:"id"`
	EventID      int64     `json:"event_id"`
	RemindBefore int       `json:"remind_before"` // 提醒前的分钟数
	Notified     bool      `json:"notified"`
	CreatedAt    time.Time `json:"created_at"`
}

type EventListResponse struct {
	Events     []EventResponse `json:"events"`
	NextCursor *string         `json:"next_cursor,omitempty"`
	HasMore    bool            `json:"has_more"`
}

type EventReminderResponse struct {
	ID           int64     `json:"id"`
	EventID      int64     `json:"event_id"`
	RemindBefore int       `json:"remind_before"`
	Notified     bool      `json:"notified"`
	CreatedAt    time.Time `json:"created_at"`
}