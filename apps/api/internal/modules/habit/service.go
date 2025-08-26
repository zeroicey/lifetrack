package habit

import (
	"context"
	"errors"
	"time"

	"github.com/zeroicey/lifetrack-api/internal/modules/habit/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

var (
	ErrHabitNotFound      = errors.New("habit not found")
	ErrHabitAlreadyExists = errors.New("habit already exists")
)

type Service struct {
	Q *repository.Queries
}

func NewService(repo *repository.Queries) *Service {
	return &Service{Q: repo}
}

func (s *Service) CreateHabit(ctx context.Context, body types.CreateHabitBody) (*types.HabitResponse, error) {
	// 检查习惯名称是否已存在
	_, err := s.Q.GetHabitByName(ctx, body.Name)
	if err == nil {
		return nil, ErrHabitAlreadyExists
	}

	habit, err := s.Q.CreateHabit(ctx, (repository.CreateHabitParams)(body))
	if err != nil {
		return nil, err
	}

	return &types.HabitResponse{
		ID:          habit.ID,
		Name:        habit.Name,
		Description: habit.Description,
		CreatedAt:   habit.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   habit.UpdatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) GetHabitById(ctx context.Context, id int64) (*types.HabitResponse, error) {
	habit, err := s.Q.GetHabitById(ctx, id)
	if err != nil {
		return nil, ErrHabitNotFound
	}

	return &types.HabitResponse{
		ID:          habit.ID,
		Name:        habit.Name,
		Description: habit.Description,
		CreatedAt:   habit.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   habit.UpdatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) GetAllHabits(ctx context.Context) ([]*types.HabitResponse, error) {
	habits, err := s.Q.GetAllHabits(ctx)
	if err != nil {
		return nil, err
	}

	var response []*types.HabitResponse
	for _, habit := range habits {
		response = append(response, &types.HabitResponse{
			ID:          habit.ID,
			Name:        habit.Name,
			Description: habit.Description,
			CreatedAt:   habit.CreatedAt.Time.Format(time.RFC3339),
			UpdatedAt:   habit.UpdatedAt.Time.Format(time.RFC3339),
		})
	}

	return response, nil
}

func (s *Service) UpdateHabitById(ctx context.Context, id int64, body types.UpdateHabitBody) (*types.HabitResponse, error) {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, id)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrHabitNotFound
	}

	// 如果名称发生变化，检查新名称是否已存在
	if body.Name != "" {
		existingHabit, err := s.Q.GetHabitByName(ctx, body.Name)
		if err == nil && existingHabit.ID != id {
			return nil, ErrHabitAlreadyExists
		}
	}

	habit, err := s.Q.UpdateHabitById(ctx, repository.UpdateHabitByIdParams{
		ID:          id,
		Name:        body.Name,
		Description: body.Description,
	})
	if err != nil {
		return nil, err
	}

	return &types.HabitResponse{
		ID:          habit.ID,
		Name:        habit.Name,
		Description: habit.Description,
		CreatedAt:   habit.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   habit.UpdatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) DeleteHabitById(ctx context.Context, id int64) error {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return ErrHabitNotFound
	}

	return s.Q.DeleteHabitById(ctx, id)
}

func (s *Service) GetHabitStats(ctx context.Context, id int64) (*types.HabitStatsResponse, error) {
	stats, err := s.Q.GetHabitStats(ctx, id)
	if err != nil {
		return nil, ErrHabitNotFound
	}

	response := &types.HabitStatsResponse{
		ID:          stats.ID,
		Name:        stats.Name,
		Description: stats.Description,
		CreatedAt:   stats.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt:   stats.UpdatedAt.Time.Format(time.RFC3339),
		TotalLogs:   stats.TotalLogs,
	}

	if stats.LastLogTime.Valid {
		response.LastLogTime = stats.LastLogTime.Time.Format(time.RFC3339)
	}
	return response, nil
}
