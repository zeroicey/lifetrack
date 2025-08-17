package types

type PresignedUploadRequest struct {
	FileName    string `json:"fileName" validate:"required,max=255"`
	ContentType string `json:"contentType" validate:"required,max=100"`
	FileSize    int64  `json:"fileSize" validate:"required,gt=0"`
	MD5         string `json:"md5" validate:"required,len=32"`
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
