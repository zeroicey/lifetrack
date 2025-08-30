package types

type PresignedUploadRequest struct {
	FileName string `json:"file_name"`
	MimeType string `json:"mime_type"`
	CoverExt string `json:"cover_ext"`
	FileSize int64  `json:"file_size"`
	CoverMD5 string `json:"cover_md5"`
	MD5      string `json:"md5"`
}
