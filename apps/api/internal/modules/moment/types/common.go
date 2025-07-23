package types

type Attachment struct {
	Type string `json:"type"`
	Pos  int    `json:"pos"`
	URL  string `json:"url"`
}

var AttachmentTypes = map[string]struct{}{
	"image": {},
	"audio": {},
	"video": {},
}
