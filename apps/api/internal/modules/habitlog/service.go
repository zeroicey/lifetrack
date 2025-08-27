package habitlog

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/habitlog/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

var (
	ErrHabitLogNotFound = errors.New("habit log not found")
	ErrHabitNotFound    = errors.New("habit not found")
)

type Service struct {
	Q *repository.Queries
}

func NewService(repo *repository.Queries) *Service {
	return &Service{Q: repo}
}

func (s *Service) CreateHabitLog(ctx context.Context, body types.CreateHabitLogBody) (*types.HabitLogResponse, error) {
	// 检查习惯是否存在并获取习惯信息
	habit, err := s.Q.GetHabitById(ctx, body.HabitID)
	if err != nil {
		return nil, ErrHabitNotFound
	}

	habitLog, err := s.Q.CreateHabitLog(ctx, repository.CreateHabitLogParams{
		HabitID:    body.HabitID,
		HappenedAt: body.HappenedAt,
	})
	if err != nil {
		return nil, err
	}

	return &types.HabitLogResponse{
		ID:         habitLog.ID,
		HabitID:    habitLog.HabitID,
		HabitName:  habit.Name,
		HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) CreateHabitLogNow(ctx context.Context, habitID int64) (*types.HabitLogResponse, error) {
	// 检查习惯是否存在并获取习惯信息
	habit, err := s.Q.GetHabitById(ctx, habitID)
	if err != nil {
		return nil, ErrHabitNotFound
	}

	habitLog, err := s.Q.CreateHabitLogNow(ctx, habitID)
	if err != nil {
		return nil, err
	}

	return &types.HabitLogResponse{
		ID:         habitLog.ID,
		HabitID:    habitLog.HabitID,
		HabitName:  habit.Name,
		HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) GetHabitLogById(ctx context.Context, id int64) (*types.HabitLogResponse, error) {
	habitLog, err := s.Q.GetHabitLogById(ctx, id)
	if err != nil {
		return nil, ErrHabitLogNotFound
	}

	return &types.HabitLogResponse{
		ID:         habitLog.ID,
		HabitID:    habitLog.HabitID,
		HabitName:  habitLog.HabitName,
		HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) GetAllHabitLogs(ctx context.Context) ([]*types.HabitLogResponse, error) {
	habitLogs, err := s.Q.GetAllHabitLogs(ctx)
	if err != nil {
		return nil, err
	}

	var response []*types.HabitLogResponse
	for _, habitLog := range habitLogs {
		response = append(response, &types.HabitLogResponse{
			ID:         habitLog.ID,
			HabitID:    habitLog.HabitID,
			HabitName:  habitLog.HabitName,
			HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
		})
	}

	return response, nil
}

func (s *Service) GetHabitLogsByHabitId(ctx context.Context, habitID int64) ([]*types.HabitLogResponse, error) {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, habitID)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrHabitNotFound
	}

	habitLogs, err := s.Q.GetHabitLogsByHabitId(ctx, habitID)
	if err != nil {
		return nil, err
	}

	var response []*types.HabitLogResponse
	for _, habitLog := range habitLogs {
		response = append(response, &types.HabitLogResponse{
			ID:         habitLog.ID,
			HabitID:    habitLog.HabitID,
			HabitName:  habitLog.HabitName,
			HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
		})
	}

	return response, nil
}

func (s *Service) GetHabitLogsByHabitIdWithLimit(ctx context.Context, habitID int64, limit int32) ([]*types.HabitLogResponse, error) {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, habitID)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrHabitNotFound
	}

	habitLogs, err := s.Q.GetHabitLogsByHabitIdWithLimit(ctx, repository.GetHabitLogsByHabitIdWithLimitParams{
		HabitID: habitID,
		Limit:   limit,
	})
	if err != nil {
		return nil, err
	}

	var response []*types.HabitLogResponse
	for _, habitLog := range habitLogs {
		response = append(response, &types.HabitLogResponse{
			ID:         habitLog.ID,
			HabitID:    habitLog.HabitID,
			HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
		})
	}

	return response, nil
}

func (s *Service) UpdateHabitLogById(ctx context.Context, id int64, happenedAt pgtype.Timestamptz) (*types.HabitLogResponse, error) {
	// 检查习惯日志是否存在
	exists, err := s.Q.HabitLogExists(ctx, id)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrHabitLogNotFound
	}

	habitLog, err := s.Q.UpdateHabitLogById(ctx, repository.UpdateHabitLogByIdParams{
		ID:         id,
		HappenedAt: happenedAt,
	})
	if err != nil {
		return nil, err
	}

	return &types.HabitLogResponse{
		ID:         habitLog.ID,
		HabitID:    habitLog.HabitID,
		HappenedAt: habitLog.HappenedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) DeleteHabitLogById(ctx context.Context, id int64) error {
	// 检查习惯日志是否存在
	exists, err := s.Q.HabitLogExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return ErrHabitLogNotFound
	}

	return s.Q.DeleteHabitLogById(ctx, id)
}

func (s *Service) DeleteHabitLogsByHabitId(ctx context.Context, habitID int64) error {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, habitID)
	if err != nil {
		return err
	}
	if !exists {
		return ErrHabitNotFound
	}

	return s.Q.DeleteHabitLogsByHabitId(ctx, habitID)
}

func (s *Service) GetHabitLogsCountByHabitId(ctx context.Context, habitID int64) (int64, error) {
	// 检查习惯是否存在
	exists, err := s.Q.HabitExists(ctx, habitID)
	if err != nil {
		return 0, err
	}
	if !exists {
		return 0, ErrHabitNotFound
	}

	return s.Q.GetHabitLogsCountByHabitId(ctx, habitID)
}
