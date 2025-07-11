package memo

type MemoResponse struct {
	ID          int64        `json:"id"`
	Content     string       `json:"content"`
	Attachments []Attachment `json:"attachments"`
	UpdatedAt   string       `json:"updated_at"`
	CreatedAt   string       `json:"created_at"`
}
