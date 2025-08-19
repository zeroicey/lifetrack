package types

import "github.com/jackc/pgx/v5/pgtype"

type Attachment struct {
	ID           string `json:"id"`
	ObjectKey    string `json:"object_key"`
	OriginalName string `json:"original_name"`
	MimeType     string `json:"mime_type"`
	FileSize     int64  `json:"file_size"`
	Position     int16  `json:"position"`
}

// AttachmentWithMeta 包含附件的完整信息，用于内部处理
type AttachmentWithMeta struct {
	ID           pgtype.UUID        `json:"id"`
	ObjectKey    string             `json:"object_key"`
	OriginalName string             `json:"original_name"`
	MimeType     string             `json:"mime_type"`
	Md5          string             `json:"md5"`
	FileSize     int64              `json:"file_size"`
	Status       string             `json:"status"`
	CreatedAt    pgtype.Timestamptz `json:"created_at"`
	UpdatedAt    pgtype.Timestamptz `json:"updated_at"`
	Position     int16              `json:"position"`
}
