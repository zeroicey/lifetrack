package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateTaskBody struct {
	GroupID  int64              `json:"group_id"`
	Content  string             `json:"content"`
	Deadline pgtype.Timestamptz `json:"deadline"`
}

type UpdateTaskBody struct {
	Content  string             `json:"content"`
	Deadline pgtype.Timestamptz `json:"deadline"`
	Status   string             `json:"status"`
}
