package types

type CreateMomentBody struct {
	Content     string                     `json:"content"`
	Attachments []AttachmentIdWithPosition `json:"attachments"`
}

type AttachmentIdWithPosition struct {
	AttachmentID string `json:"attachment_id"`
	Position     int16  `json:"position"`
}

type AddAttachmentBody struct {
	AttachmentIdWithPosition
}

type PaginatedQuery struct {
	Cursor string `json:"cursor"`
	Limit  int    `json:"limit"`
}
