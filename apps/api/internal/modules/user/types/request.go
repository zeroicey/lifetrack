package types

import "github.com/jackc/pgx/v5/pgtype"

type RegisterUserBody struct {
	Email        string      `json:"email" validate:"required,email"`
	Name         string      `json:"name" validate:"required"`
	Password     string      `json:"password" validate:"required,min=6"`
	Birthday     pgtype.Date `json:"birthday"`
	AvatarBase64 pgtype.Text `json:"avatar_base64"`
	Bio          pgtype.Text `json:"bio"`
}