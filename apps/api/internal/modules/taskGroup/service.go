package taskgroup

import (
	"context"
	"errors"

	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

func (s *Service) ListGroups(ctx context.Context) ([]repository.TaskGroup, error) {
	return s.Q.GetAllTaskGroups(ctx)
}

func (s *Service) CreateGroup(ctx context.Context, params repository.CreateTaskGroupParams) (repository.TaskGroup, error) {
	return s.Q.CreateTaskGroup(ctx, params)
}

func (s *Service) GetGroupById(ctx context.Context, id int64) (*types.TaskGroupWithTasks, error) {
	if err := s.checkGroupExists(ctx, id); err != nil {
		return nil, err
	}
	taskGroup, err := s.Q.GetTaskGroupById(ctx, id)
	if err != nil {
		return nil, err
	}

	tasks, err := s.Q.GetTasksByGroupId(ctx, id)
	if err != nil {
		return nil, err
	}

	resp := &types.TaskGroupWithTasks{
		TaskGroup: taskGroup,
		Tasks:     tasks,
	}

	return resp, nil
}

func (s *Service) UpdateGroup(ctx context.Context, params repository.UpdateTaskGroupParams) (repository.TaskGroup, error) {
	if err := s.checkGroupExists(ctx, params.ID); err != nil {
		return repository.TaskGroup{}, err
	}
	return s.Q.UpdateTaskGroup(ctx, params)
}

func (s *Service) DeleteGroup(ctx context.Context, id int64) error {
	if err := s.checkGroupExists(ctx, id); err != nil {
		return err
	}
	return s.Q.DeleteTaskGroup(ctx, id)
}

func (s *Service) checkGroupExists(ctx context.Context, id int64) error {
	exists, err := s.Q.TaskGroupExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return errors.New("task group not found")
	}
	return nil
}
