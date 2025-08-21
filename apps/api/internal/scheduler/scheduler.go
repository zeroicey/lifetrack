package scheduler

import (
	"context"
	"time"

	"github.com/robfig/cron/v3"
	"go.uber.org/zap"

	"github.com/zeroicey/lifetrack-api/internal/modules/event"
)

// Scheduler 定时任务调度器
type Scheduler struct {
	cron         *cron.Cron
	eventService *event.Service
	logger       *zap.Logger
}

// NewScheduler 创建新的调度器实例
func NewScheduler(eventService *event.Service, logger *zap.Logger) *Scheduler {
	return &Scheduler{
		cron:         cron.New(cron.WithSeconds()),
		eventService: eventService,
		logger:       logger,
	}
}

// Start 启动调度器
func (s *Scheduler) Start() error {
	// 每分钟检查一次事件提醒
	_, err := s.cron.AddFunc("0 * * * * *", func() {
		ctx := context.Background()
		s.logger.Debug("Running event reminder check", zap.Time("timestamp", time.Now()))
		s.eventService.CheckAndLogReminders(ctx)
	})
	if err != nil {
		s.logger.Error("Failed to add cron job", zap.Error(err))
		return err
	}

	s.cron.Start()
	s.logger.Info("Event reminder scheduler started")
	return nil
}

// Stop 停止调度器
func (s *Scheduler) Stop() {
	ctx := s.cron.Stop()
	<-ctx.Done()
	s.logger.Info("Event reminder scheduler stopped")
}

// IsRunning 检查调度器是否正在运行
func (s *Scheduler) IsRunning() bool {
	return len(s.cron.Entries()) > 0
}