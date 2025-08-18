package types

type CreateMomentBody struct {
	Content       string                   `json:"content"`
	AttachmentIDs []AttachmentWithPosition `json:"attachment_ids"` // 附件ID列表及其位置
}

type AttachmentWithPosition struct {
	AttachmentID string `json:"attachment_id"`
	Position     int16  `json:"position"`
}

type AddAttachmentBody struct {
	AttachmentID string `json:"attachment_id"`
	Position     int16  `json:"position"`
}

type PaginatedQuery struct {
	Cursor string `json:"cursor"`
	Limit  int    `json:"limit"` // 每页数量，默认 15
}
