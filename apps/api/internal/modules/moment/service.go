package moment

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	"github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type Service struct {
	Q         *repository.Queries
	DB        *pgxpool.Pool
	logger    *zap.Logger
	converter *Converter
}

var ErrMomentNotFound = errors.New("moment not found")

func NewService(db *pgxpool.Pool, q *repository.Queries, logger *zap.Logger) *Service {
	return &Service{
		Q:         q,
		logger:    logger,
		converter: NewConverter(q),
		DB:        db,
	}
}

func (s *Service) ListMomentsPaginated(ctx context.Context, cursor int64, limit int) ([]types.MomentResponse, *int64, error) {
	limit = func() int {
		if limit <= 0 {
			return 10
		}
		if limit > 100 {
			return 100
		}
		return limit
	}()

	cursorTs := s.converter.CursorToTimestamp(cursor)

	// Get more one moment to check if there is a next page
	_moments, err := s.Q.GetMomentsPaginated(ctx, repository.GetMomentsPaginatedParams{
		Column1: cursorTs,
		Limit:   int32(limit + 1),
	})
	if err != nil {
		return nil, nil, err
	}

	hasNext := len(_moments) > limit
	var items []repository.Moment
	if hasNext {
		items = _moments[:limit]
	} else {
		items = _moments
	}

	// nextCursor is the timestamp of the last moment in the items slice
	// If there is no next page, nextCursor is nil
	var nextCursor *int64
	if hasNext && len(items) > 0 {
		last := items[len(items)-1]
		ts := last.CreatedAt.Time.UnixMilli()
		nextCursor = &ts
	}

	// 构建响应，包含附件信息
	moments, err := s.converter.ToMomentResponses(ctx, items)
	if err != nil {
		return nil, nil, err
	}

	return moments, nextCursor, nil
}

func (s *Service) CreateMoment(ctx context.Context, body types.CreateMomentBody) (types.MomentResponse, error) {
	tx, err := s.DB.Begin(ctx)
	if err != nil {
		return types.MomentResponse{}, err
	}
	defer tx.Rollback(ctx)

	qtx := s.Q.WithTx(tx)
	moment, err := qtx.CreateMoment(ctx, body.Content)
	if err != nil {
		return types.MomentResponse{}, errors.New("failed to create moment")
	}

	for _, attachment := range body.Attachments {
		attachmentID, err := pkg.StringToPgUUID(attachment.AttachmentID)
		if err != nil {
			return types.MomentResponse{}, errors.New("invalid attachment ID format")
		}

		if attachment.Position < 0 || attachment.Position > 9 {
			return types.MomentResponse{}, errors.New("invalid attachment position")
		}

		err = qtx.AddAttachmentToMoment(ctx, repository.AddAttachmentToMomentParams{
			MomentID:     moment.ID,
			AttachmentID: attachmentID,
			Position:     attachment.Position,
		})
		if err != nil {
			return types.MomentResponse{}, errors.New("failed to add attachment to moment")
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return types.MomentResponse{}, errors.New("failed to commit transaction")
	}

	return s.converter.ToMomentResponse(ctx, moment)
}

func (s *Service) GetMomentByID(ctx context.Context, id int64) (types.MomentResponse, error) {
	if err := s.checkMomentExists(ctx, id); err != nil {
		return types.MomentResponse{}, err
	}
	_moment, err := s.Q.GetMomentByID(ctx, id)
	if err != nil {
		return types.MomentResponse{}, err
	}

	// 获取附件信息并转换为响应
	return s.converter.ToMomentResponse(ctx, _moment)
}

func (s *Service) DeleteMomentByID(ctx context.Context, id int64) error {
	if err := s.checkMomentExists(ctx, id); err != nil {
		return err
	}
	return s.Q.DeleteMomentByID(ctx, id)
}

func (s *Service) checkMomentExists(ctx context.Context, id int64) error {
	exists, err := s.Q.MomentExists(ctx, id)
	if err != nil {
		return err
	}
	if !exists {
		return ErrMomentNotFound
	}
	return nil
}

// AddAttachmentToMoment 向指定的 moment 添加附件
func (s *Service) AddAttachmentToMoment(ctx context.Context, momentID int64, attachmentID string, position int16) error {
	// 检查 moment 是否存在
	if err := s.checkMomentExists(ctx, momentID); err != nil {
		return ErrMomentNotFound
	}

	// 将字符串 ID 转换为 UUID
	attachmentUUID, err := pkg.StringToPgUUID(attachmentID)
	if err != nil {
		s.logger.Sugar().Errorf("invalid attachment ID format: %v", err)
		return errors.New("invalid attachment ID format")
	}

	err = s.Q.AddAttachmentToMoment(ctx, repository.AddAttachmentToMomentParams{
		MomentID:     momentID,
		AttachmentID: attachmentUUID,
		Position:     position,
	})
	if err != nil {
		s.logger.Sugar().Errorf("failed to add attachment to moment: %v", err)
		return err
	}
	return nil
}

// RemoveAttachmentFromMoment 从指定的 moment 移除附件
func (s *Service) RemoveAttachmentFromMoment(ctx context.Context, momentID int64, attachmentID string) error {
	// 检查 moment 是否存在
	if err := s.checkMomentExists(ctx, momentID); err != nil {
		return err
	}

	// 将字符串 ID 转换为 UUID
	attachmentUUID, err := pkg.StringToPgUUID(attachmentID)
	if err != nil {
		return errors.New("invalid attachment ID format")
	}

	return s.Q.RemoveAttachmentFromMoment(ctx, repository.RemoveAttachmentFromMomentParams{
		MomentID:     momentID,
		AttachmentID: attachmentUUID,
	})
}
