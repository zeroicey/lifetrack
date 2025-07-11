package memo

type CreateMemoBody struct {
	Content     string       `json:"content"`
	Attachments []Attachment `json:"attachments"` // 可以为 null/空对象
}

type PaginatedQuery struct {
	Cursor string `json:"cursor"`
	Limit  int    `json:"limit"` // 每页数量，默认 15
}
