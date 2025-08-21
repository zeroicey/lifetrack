package event

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/event/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type Service struct {
	Q      *repository.Queries
	logger *zap.Logger
}

// ErrEventNotFound 是当事件不存在时返回的哨兵错误
var ErrEventNotFound = errors.New("event not found")

func NewService(q *repository.Queries, logger *zap.Logger) *Service {
	return &Service{Q: q, logger: logger}
}

// GetAllEvents 获取所有事件及其提醒
func (s *Service) GetAllEvents(ctx context.Context) ([]types.EventResponse, error) {
	rows, err := s.Q.GetAllEvents(ctx)
	if err != nil {
		s.logger.Error("Failed to get all events", zap.Error(err))
		return nil, err
	}

	return s.groupEventRows(rows), nil
}

// GetEventByID 根据ID获取事件及其提醒
func (s *Service) GetEventByID(ctx context.Context, id int64) (types.EventResponse, error) {
	rows, err := s.Q.GetEventByID(ctx, id)
	if err != nil {
		s.logger.Error("Failed to get event by ID", zap.Int64("id", id), zap.Error(err))
		return types.EventResponse{}, ErrEventNotFound
	}

	// 将单行结果转换为切片格式以复用groupEventRows方法
	rowSlice := []repository.GetAllEventsRow{
		{
			ID:                rows.ID,
			Name:              rows.Name,
			Place:             rows.Place,
			Description:       rows.Description,
			StartTime:         rows.StartTime,
			EndTime:           rows.EndTime,
			CreatedAt:         rows.CreatedAt,
			UpdatedAt:         rows.UpdatedAt,
			ReminderID:        rows.ReminderID,
			RemindBefore:      rows.RemindBefore,
			Notified:          rows.Notified,
			ReminderCreatedAt: rows.ReminderCreatedAt,
		},
	}

	grouped := s.groupEventRows(rowSlice)
	if len(grouped) == 0 {
		return types.EventResponse{}, ErrEventNotFound
	}

	return grouped[0], nil
}

// CreateEvent 创建新事件
func (s *Service) CreateEvent(ctx context.Context, body types.CreateEventBody) (types.EventResponse, error) {
	// 验证时间
	if body.EndTime.Before(body.StartTime) {
		return types.EventResponse{}, errors.New("end time must be after start time")
	}

	// 转换时间格式
	startTime := pgtype.Timestamptz{}
	startTime.Scan(body.StartTime)
	endTime := pgtype.Timestamptz{}
	endTime.Scan(body.EndTime)

	// 创建事件
	event, err := s.Q.CreateEvent(ctx, repository.CreateEventParams{
		Name:        body.Name,
		Place:       body.Place,
		Description: body.Description,
		StartTime:   startTime,
		EndTime:     endTime,
	})
	if err != nil {
		s.logger.Error("Failed to create event", zap.Error(err))
		return types.EventResponse{}, err
	}

	// 创建提醒
	var reminders []types.EventReminder
	for _, reminderMinutes := range body.Reminders {
		reminder, err := s.Q.CreateEventReminder(ctx, repository.CreateEventReminderParams{
			EventID:      event.ID,
			RemindBefore: int32(reminderMinutes),
		})
		if err != nil {
			s.logger.Error("Failed to create event reminder", zap.Error(err))
			continue // 继续创建其他提醒
		}

		reminders = append(reminders, types.EventReminder{
			ID:           reminder.ID,
			EventID:      reminder.EventID,
			RemindBefore: int(reminder.RemindBefore),
			Notified:     reminder.Notified,
			CreatedAt:    reminder.CreatedAt.Time,
		})
	}

	return types.EventResponse{
		ID:          event.ID,
		Name:        event.Name,
		Place:       event.Place,
		Description: event.Description,
		StartTime:   event.StartTime.Time,
		EndTime:     event.EndTime.Time,
		Reminders:   reminders,
		CreatedAt:   event.CreatedAt.Time,
		UpdatedAt:   event.UpdatedAt.Time,
	}, nil
}

// UpdateEvent 更新事件
func (s *Service) UpdateEvent(ctx context.Context, id int64, body types.UpdateEventBody) (types.EventResponse, error) {
	// 验证时间
	if body.EndTime.Before(body.StartTime) {
		return types.EventResponse{}, errors.New("end time must be after start time")
	}

	// 转换时间格式
	startTime := pgtype.Timestamptz{}
	startTime.Scan(body.StartTime)
	endTime := pgtype.Timestamptz{}
	endTime.Scan(body.EndTime)

	// 更新事件
	event, err := s.Q.UpdateEvent(ctx, repository.UpdateEventParams{
		ID:          id,
		Name:        body.Name,
		Place:       body.Place,
		Description: body.Description,
		StartTime:   startTime,
		EndTime:     endTime,
	})
	if err != nil {
		s.logger.Error("Failed to update event", zap.Int64("id", id), zap.Error(err))
		return types.EventResponse{}, err
	}

	// 获取现有提醒
	reminders, err := s.Q.GetEventRemindersByEventID(ctx, id)
	if err != nil {
		s.logger.Error("Failed to get event reminders", zap.Int64("id", id), zap.Error(err))
	}

	var reminderResponses []types.EventReminder
	for _, reminder := range reminders {
		reminderResponses = append(reminderResponses, types.EventReminder{
			ID:           reminder.ID,
			EventID:      reminder.EventID,
			RemindBefore: int(reminder.RemindBefore),
			Notified:     reminder.Notified,
			CreatedAt:    reminder.CreatedAt.Time,
		})
	}

	return types.EventResponse{
		ID:          event.ID,
		Name:        event.Name,
		Place:       event.Place,
		Description: event.Description,
		StartTime:   event.StartTime.Time,
		EndTime:     event.EndTime.Time,
		Reminders:   reminderResponses,
		CreatedAt:   event.CreatedAt.Time,
		UpdatedAt:   event.UpdatedAt.Time,
	}, nil
}

// DeleteEvent 删除事件
func (s *Service) DeleteEvent(ctx context.Context, id int64) error {
	err := s.Q.DeleteEvent(ctx, id)
	if err != nil {
		s.logger.Error("Failed to delete event", zap.Int64("id", id), zap.Error(err))
		return err
	}
	return nil
}

// GetEventsByDateRange 根据日期范围获取事件
func (s *Service) GetEventsByDateRange(ctx context.Context, startDate, endDate string) ([]types.EventResponse, error) {
	// 解析日期
	startTime, err := time.Parse("2006-01-02", startDate)
	if err != nil {
		return nil, fmt.Errorf("invalid start date format: %w", err)
	}
	endTime, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, fmt.Errorf("invalid end date format: %w", err)
	}

	// 设置时间范围（开始日期的00:00:00到结束日期的23:59:59）
	startTime = startTime.UTC()
	endTime = endTime.Add(24*time.Hour - time.Second).UTC()

	// 转换为pgtype
	startTimePg := pgtype.Timestamptz{}
	startTimePg.Scan(startTime)
	endTimePg := pgtype.Timestamptz{}
	endTimePg.Scan(endTime)

	rows, err := s.Q.GetEventsByDateRange(ctx, repository.GetEventsByDateRangeParams{
		StartTime: startTimePg,
		EndTime:   endTimePg,
	})
	if err != nil {
		s.logger.Error("Failed to get events by date range", zap.String("start", startDate), zap.String("end", endDate), zap.Error(err))
		return nil, err
	}

	// 转换为GetAllEventsRow格式以复用groupEventRows方法
	var allEventsRows []repository.GetAllEventsRow
	for _, row := range rows {
		allEventsRows = append(allEventsRows, repository.GetAllEventsRow{
			ID:                row.ID,
			Name:              row.Name,
			Place:             row.Place,
			Description:       row.Description,
			StartTime:         row.StartTime,
			EndTime:           row.EndTime,
			CreatedAt:         row.CreatedAt,
			UpdatedAt:         row.UpdatedAt,
			ReminderID:        row.ReminderID,
			RemindBefore:      row.RemindBefore,
			Notified:          row.Notified,
			ReminderCreatedAt: row.ReminderCreatedAt,
		})
	}

	return s.groupEventRows(allEventsRows), nil
}

// CreateEventReminder 为事件创建提醒
func (s *Service) CreateEventReminder(ctx context.Context, eventID int64, body types.CreateEventReminderBody) (types.EventReminderResponse, error) {
	reminder, err := s.Q.CreateEventReminder(ctx, repository.CreateEventReminderParams{
		EventID:      eventID,
		RemindBefore: int32(body.RemindBefore),
	})
	if err != nil {
		s.logger.Error("Failed to create event reminder", zap.Int64("eventID", eventID), zap.Error(err))
		return types.EventReminderResponse{}, err
	}

	return types.EventReminderResponse{
		ID:           reminder.ID,
		EventID:      reminder.EventID,
		RemindBefore: int(reminder.RemindBefore),
		Notified:     reminder.Notified,
		CreatedAt:    reminder.CreatedAt.Time,
	}, nil
}

// DeleteEventReminder 删除事件提醒
func (s *Service) DeleteEventReminder(ctx context.Context, reminderID int64) error {
	err := s.Q.DeleteEventReminder(ctx, reminderID)
	if err != nil {
		s.logger.Error("Failed to delete event reminder", zap.Int64("reminderID", reminderID), zap.Error(err))
		return err
	}
	return nil
}

// CheckAndLogReminders 检查需要提醒的事件并在日志中输出
func (s *Service) CheckAndLogReminders(ctx context.Context) {
	reminders, err := s.Q.GetEventRemindersToNotify(ctx)
	if err != nil {
		s.logger.Error("Failed to get event reminders to notify", zap.Error(err))
		return
	}

	for _, reminder := range reminders {
		// 在日志中输出提醒信息
		s.logger.Info("Event Reminder",
			zap.Int64("reminder_id", reminder.ID),
			zap.Int64("event_id", reminder.EventID),
			zap.String("event_name", reminder.Name),
			zap.String("event_place", reminder.Place),
			zap.String("event_description", reminder.Description),
			zap.Time("event_start_time", reminder.StartTime.Time),
			zap.Int32("remind_before_minutes", reminder.RemindBefore),
		)

		// 标记为已通知
		err := s.Q.UpdateEventReminderNotified(ctx, repository.UpdateEventReminderNotifiedParams{
			ID:       reminder.ID,
			Notified: true,
		})
		if err != nil {
			s.logger.Error("Failed to update reminder notified status",
				zap.Int64("reminder_id", reminder.ID),
				zap.Error(err),
			)
		}
	}
}

// groupEventRows 将数据库查询结果按事件分组，合并提醒信息
func (s *Service) groupEventRows(rows []repository.GetAllEventsRow) []types.EventResponse {
	eventMap := make(map[int64]*types.EventResponse)

	for _, row := range rows {
		// 如果事件不存在，创建新的事件响应
		if _, exists := eventMap[row.ID]; !exists {
			eventMap[row.ID] = &types.EventResponse{
				ID:          row.ID,
				Name:        row.Name,
				Place:       row.Place,
				Description: row.Description,
				StartTime:   row.StartTime.Time,
				EndTime:     row.EndTime.Time,
				Reminders:   []types.EventReminder{},
				CreatedAt:   row.CreatedAt.Time,
				UpdatedAt:   row.UpdatedAt.Time,
			}
		}

		// 如果有提醒信息，添加到事件中
		if row.ReminderID.Valid {
			reminder := types.EventReminder{
				ID:           row.ReminderID.Int64,
				EventID:      row.ID,
				RemindBefore: int(row.RemindBefore.Int32),
				Notified:     row.Notified.Bool,
				CreatedAt:    row.ReminderCreatedAt.Time,
			}
			eventMap[row.ID].Reminders = append(eventMap[row.ID].Reminders, reminder)
		}
	}

	// 转换为切片
	var events []types.EventResponse
	for _, event := range eventMap {
		events = append(events, *event)
	}

	return events
}
