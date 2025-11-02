package moment

type Moment struct {
	ID        int64  `json:"id"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type CreateMomentRequest struct {
	Content string `json:"content"`
}

type CreateMomentAttachmentRequest struct {
	OriginalName string `json:"original_name"`
	MimeType     string `json:"mime_type"`
	FileSize     int64  `json:"file_size"`
	Md5          string `json:"md5"`
}
