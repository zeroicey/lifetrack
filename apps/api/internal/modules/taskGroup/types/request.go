package types

import "github.com/jackc/pgx/v5/pgtype"

type CreateGroupBody struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
	Type        string      `json:"type"`
}

type UpdateGroupBody struct {
	Name        string      `json:"name"`
	Description pgtype.Text `json:"description"`
	Type        string      `json:"type"`
}

type ListGroupsParams struct {
	Name *string // 使用指针来区分“未提供”和“提供空字符串”
	Type *string
}
