package taskgroup

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/taskgroup/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

func (s *Service) ListGroups(ctx context.Context) ([]types.TaskGroupResponse, error) {
	groups, err := s.Q.GetAllTaskGroups(ctx)
	if err != nil {
		return nil, err
	}

	var responses []types.TaskGroupResponse
	for _, group := range groups {
		responses = append(responses, s.convertToTaskGroupResponse(group))
	}
	return responses, nil
}

func (s *Service) CreateGroup(ctx context.Context, params repository.CreateTaskGroupParams) (types.TaskGroupResponse, error) {
	group, err := s.Q.CreateTaskGroup(ctx, params)
	if err != nil {
		return types.TaskGroupResponse{}, err
	}
	return s.convertToTaskGroupResponse(group), nil
}

func (s *Service) GetGroupById(ctx context.Context, id int64) (*types.TaskGroupWithTasksResponse, error) {
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

	var taskResponses []types.TaskResponse
	for _, task := range tasks {
		taskResponses = append(taskResponses, s.convertToTaskResponse(task))
	}

	resp := &types.TaskGroupWithTasksResponse{
		ID:          taskGroup.ID,
		Name:        taskGroup.Name,
		Description: s.getStringFromPgText(taskGroup.Description),
		CreatedAt:   taskGroup.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   taskGroup.UpdatedAt.Time.Format(time.RFC3339),
		Tasks:       taskResponses,
	}

	return resp, nil
}

func (s *Service) UpdateGroup(ctx context.Context, params repository.UpdateTaskGroupByIdParams) (types.TaskGroupResponse, error) {
	if err := s.checkGroupExists(ctx, params.ID); err != nil {
		return types.TaskGroupResponse{}, err
	}
	group, err := s.Q.UpdateTaskGroupById(ctx, params)
	if err != nil {
		return types.TaskGroupResponse{}, err
	}
	return s.convertToTaskGroupResponse(group), nil
}

func (s *Service) DeleteGroup(ctx context.Context, id int64) error {
	if err := s.checkGroupExists(ctx, id); err != nil {
		return err
	}
	return s.Q.DeleteTaskGroupById(ctx, id)
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

func (s *Service) convertToTaskGroupResponse(group repository.TaskGroup) types.TaskGroupResponse {
	return types.TaskGroupResponse{
		ID:          group.ID,
		Name:        group.Name,
		Description: s.getStringFromPgText(group.Description),
		CreatedAt:   group.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   group.UpdatedAt.Time.Format(time.RFC3339),
	}
}

func (s *Service) convertToTaskResponse(task repository.Task) types.TaskResponse {
	return types.TaskResponse{
		ID:          task.ID,
		GroupID:     task.GroupID,
		Pos:         task.Pos,
		Content:     task.Content,
		Description: s.getStringFromPgText(task.Description),
		Status:      string(task.Status),
		Deadline:    s.getStringFromPgTimestamp(task.Deadline),
		CreatedAt:   task.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   task.UpdatedAt.Time.Format(time.RFC3339),
	}
}

func (s *Service) getStringFromPgText(pgText pgtype.Text) string {
	if pgText.Valid {
		return pgText.String
	}
	return ""
}

func (s *Service) getStringFromPgTimestamp(pgTimestamp pgtype.Timestamptz) string {
	if pgTimestamp.Valid {
		return pgTimestamp.Time.Format(time.RFC3339)
	}
	return ""
}
