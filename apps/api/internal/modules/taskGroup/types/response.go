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

type TaskResponse = tasktypes.TaskResponse

type TaskGroupWithTasksResponse struct {
	TaskGroupResponse
	Tasks []TaskResponse `json:"tasks"`
}
