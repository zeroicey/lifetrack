package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateHabitLogBody struct {
	HabitID    int64              `json:"habit_id"`
	HappenedAt pgtype.Timestamptz `json:"happened_at"`
}

type UpdateHabitLogBody struct {
	HappenedAt pgtype.Timestamptz `json:"happened_at"`
}

type GetHabitLogsParams struct {
	HabitID *int64 `json:"habit_id,omitempty"`
	Limit   *int32 `json:"limit,omitempty"`
}
