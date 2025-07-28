package types

type PresignedUploadResponse struct {
	UploadURL string `json:"uploadURL"`
	ObjectKey string `json:"objectKey"`
	ExpiresIn int    `json:"expiresIn"`
}

type PresignedDownloadResponse struct {
	DownloadURL string `json:"downloadURL"`
	ExpiresIn   int    `json:"expiresIn"`
}

type TemporaryAccessResponse struct {
	URL         string `json:"url"`
	ObjectKey   string `json:"objectKey"`
	ContentType string `json:"contentType"`
	ExpiresAt   int64  `json:"expiresAt"` // Unix 时间戳
	ExpiresIn   int    `json:"expiresIn"` // 剩余秒数
}

type FileInfo struct {
	ObjectKey   string `json:"objectKey"`
	FileName    string `json:"fileName"`
	ContentType string `json:"contentType"`
	Size        int64  `json:"size"`
	URL         string `json:"url"`
	ExpiresAt   int64  `json:"expiresAt"` // 新增：过期时间
}

type DeleteFileResponse struct {
	Success   bool   `json:"success"`
	ObjectKey string `json:"objectKey"`
}

type BatchTemporaryAccessRequest struct {
	ObjectKeys    []string `json:"objectKeys" binding:"required"`
	ExpiryMinutes int      `json:"expiryMinutes"` // 可选，默认60分钟
}
