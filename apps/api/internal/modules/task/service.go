package task

import (
	"context"
	"errors"
	"time"

	"github.com/zeroicey/lifetrack-api/internal/modules/task/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

func (s *Service) CreateTask(ctx context.Context, params repository.CreateTaskParams) (types.TaskResponse, error) {
	// 检查任务组是否存在
	groupExists, err := s.Q.TaskGroupExists(ctx, params.GroupID)
	if err != nil {
		return types.TaskResponse{}, err
	}
	if !groupExists {
		return types.TaskResponse{}, errors.New("task group not found")
	}

	task, err := s.Q.CreateTask(ctx, params)
	if err != nil {
		return types.TaskResponse{}, err
	}

	return s.convertToTaskResponse(task), nil
}

func (s *Service) GetTaskById(ctx context.Context, id int64) (types.TaskResponse, error) {
	if err := s.checkTaskExists(ctx, id); err != nil {
		return types.TaskResponse{}, err
	}
	task, err := s.Q.GetTaskById(ctx, id)
	if err != nil {
		return types.TaskResponse{}, err
	}
	return s.convertToTaskResponse(task), nil
}

func (s *Service) UpdateTask(ctx context.Context, params repository.UpdateTaskByIdParams) (types.TaskResponse, error) {
	if err := s.checkTaskExists(ctx, params.ID); err != nil {
		return types.TaskResponse{}, err
	}
	task, err := s.Q.UpdateTaskById(ctx, params)
	if err != nil {
		return types.TaskResponse{}, err
	}
	return s.convertToTaskResponse(task), nil
}

func (s *Service) DeleteTask(ctx context.Context, id int64) error {
	if err := s.checkTaskExists(ctx, id); err != nil {
		return err
	}
	return s.Q.DeleteTaskById(ctx, id)
}

func (s *Service) checkTaskExists(ctx context.Context, id int64) error {
	exists, err := s.Q.TaskExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New("task not found")
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
		Pos:         task.Pos,
		Content:     task.Content,
		Description: description,
		Status:      string(task.Status),
		Deadline:    deadline,
		CreatedAt:   task.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   task.UpdatedAt.Time.Format(time.RFC3339),
	}
}
