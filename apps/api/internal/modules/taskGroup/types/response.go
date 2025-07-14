package types

import (
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type TaskGroupWithTasks struct {
	repository.TaskGroup
	Tasks []repository.Task `json:"tasks"`
}