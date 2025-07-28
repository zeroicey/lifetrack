package types

type PresignedUploadRequest struct {
	FileName    string `json:"fileName" binding:"required"`
	ContentType string `json:"contentType"`
}

type PresignedDownloadRequest struct {
	ObjectKey string `json:"objectKey" binding:"required"`
}

type DeleteFileRequest struct {
	ObjectKey string `json:"objectKey" binding:"required"`
}

type TemporaryAccessRequest struct {
	ObjectKey     string `json:"objectKey" binding:"required"`
	ExpiryMinutes int    `json:"expiryMinutes"` // 可选，默认60分钟
}
