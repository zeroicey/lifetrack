package types

type PresignedUploadResponse struct {
	AttachmentID string `json:"attachmentId"`
	UploadURL    string `json:"uploadUrl"`
	ObjectKey    string `json:"objectKey"`
}
