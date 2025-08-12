package types

import tasktypes "github.com/zeroicey/lifetrack-api/internal/modules/task/types"

type TaskGroupResponse struct {
	ID          int64  `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Type        string `json:"type"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

// Reuse the Task module's response type to avoid duplication
type TaskResponse = tasktypes.TaskResponse

type TaskGroupWithTasksResponse struct {
	ID          int64          `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description,omitempty"`
	Type        string         `json:"type"`
	CreatedAt   string         `json:"created_at"`
	UpdatedAt   string         `json:"updated_at"`
	Tasks       []TaskResponse `json:"tasks"`
}
