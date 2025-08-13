package task

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/zeroicey/lifetrack-api/internal/modules/task/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries
}

var (
	ErrTaskNotFound      = errors.New("task not found")
	ErrTaskGroupNotFound = errors.New("task group not found")
)

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

func (s *Service) CreateTask(ctx context.Context, params repository.CreateTaskParams) (types.TaskResponse, error) {
	groupExists, err := s.Q.TaskGroupExistsById(ctx, params.GroupID)
	if err != nil {
		return types.TaskResponse{}, err
	}
	if !groupExists {
		return types.TaskResponse{}, ErrTaskGroupNotFound
	}

	task, err := s.Q.CreateTask(ctx, params)
	if err != nil {
		return types.TaskResponse{}, err
	}

	return s.convertToTaskResponse(task), nil
}

func (s *Service) GetTasksByGroupId(ctx context.Context, id int64) ([]types.TaskResponse, error) {
	groupExists, err := s.Q.TaskGroupExistsById(ctx, id)
	if err != nil {
		return nil, err
	}
	if !groupExists {
		return nil, ErrTaskGroupNotFound
	}

	tasks, err := s.Q.GetTasksByGroupId(ctx, id)
	if err != nil {
		return nil, err
	}

	var responses []types.TaskResponse
	for _, task := range tasks {
		responses = append(responses, s.convertToTaskResponse(task))
	}
	return responses, nil
}

// service.go
func (s *Service) UpdateTask(ctx context.Context, params repository.UpdateTaskByIdParams) (types.TaskResponse, error) {
	task, err := s.Q.UpdateTaskById(ctx, params)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return types.TaskResponse{}, ErrTaskNotFound
		}
		return types.TaskResponse{}, err
	}
	return s.convertToTaskResponse(task), nil
}

func (s *Service) DeleteTask(ctx context.Context, id int64) error {
	_, err := s.Q.DeleteTaskById(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrTaskNotFound
		}
		return err
	}
	return nil
}

func (s *Service) convertToTaskResponse(task repository.Task) types.TaskResponse {
	var description string
	if task.Description.Valid {
		description = task.Description.String
	}

	var deadline string
	if task.Deadline.Valid {
		deadline = task.Deadline.Time.Format(time.RFC3339)
	}

	return types.TaskResponse{
		ID:          task.ID,
		GroupID:     task.GroupID,
		Content:     task.Content,
		Description: description,
		Status:      string(task.Status),
		Deadline:    deadline,
		CreatedAt:   task.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   task.UpdatedAt.Time.Format(time.RFC3339),
	}
}
