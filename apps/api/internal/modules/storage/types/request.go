package types

type PresignedUploadRequest struct {
	FileName string `json:"file_name"`
	MimeType string `json:"mime_type"`
	FileSize int64  `json:"file_size"`
	MD5      string `json:"md5"`
}

type DeleteFileRequest struct {
	ObjectKey string `json:"object_key"`
}
