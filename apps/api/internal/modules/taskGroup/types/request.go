package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateGroupBody struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
}

type UpdateGroupBody struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
}