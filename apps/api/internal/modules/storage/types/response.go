package types

type PresignedUploadResponse struct {
	AttachmentID string `json:"attachmentId"`
	UploadURL    string `json:"uploadUrl,omitempty"`
	ObjectKey    string `json:"objectKey"`
	IsDuplicate  bool   `json:"isDuplicate"`
}
