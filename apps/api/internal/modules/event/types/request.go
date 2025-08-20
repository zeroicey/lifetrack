package types

import "time"

type CreateEventBody struct {
	Name        string    `json:"name" validate:"required"`
	Place       string    `json:"place" validate:"required"`
	Description string    `json:"description" validate:"required"`
	StartTime   time.Time `json:"start_time" validate:"required"`
	EndTime     time.Time `json:"end_time" validate:"required"`
	Reminders   []int     `json:"reminders,omitempty"` // 提醒时间（分钟）
}

type UpdateEventBody struct {
	Name        string    `json:"name" validate:"required"`
	Place       string    `json:"place" validate:"required"`
	Description string    `json:"description" validate:"required"`
	StartTime   time.Time `json:"start_time" validate:"required"`
	EndTime     time.Time `json:"end_time" validate:"required"`
}

type CreateEventReminderBody struct {
	RemindBefore int `json:"remind_before" validate:"required,min=1"` // 提醒前的分钟数
}

type DateRangeQuery struct {
	StartDate string `json:"start_date" validate:"required"` // YYYY-MM-DD format
	EndDate   string `json:"end_date" validate:"required"`   // YYYY-MM-DD format
}

type PaginatedQuery struct {
	Cursor string `json:"cursor"`
	Limit  int    `json:"limit"` // 每页数量，默认 10
}
