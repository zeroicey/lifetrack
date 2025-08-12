package types

type TaskResponse struct {
	ID          int64  `json:"id"`
	GroupID     int64  `json:"group_id"`
	Content     string `json:"content"`
	Description string `json:"description,omitempty"`
	Status      string `json:"status"`
	Deadline    string `json:"deadline,omitempty"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}
