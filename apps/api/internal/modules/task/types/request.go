package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateTaskBody struct {
	GroupID     int64              `json:"group_id"`
	Pos         string             `json:"pos"`
	Content     string             `json:"content"`
	Description pgtype.Text        `json:"description"`
	Deadline    pgtype.Timestamptz `json:"deadline"`
}

type UpdateTaskBody struct {
	Pos         string             `json:"pos"`
	Content     string             `json:"content"`
	Description pgtype.Text        `json:"description"`
	Deadline    pgtype.Timestamptz `json:"deadline"`
}
