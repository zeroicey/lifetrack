package types

type PresignedUploadResponse struct {
	AttachmentID string `json:"attachment_id"`
	UploadURL    string `json:"upload_url,omitempty"`
	ObjectKey    string `json:"object_key"`
	IsDuplicate  bool   `json:"is_duplicate"`
}
