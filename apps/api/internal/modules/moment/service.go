package moment

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
	"go.uber.org/zap"
)

type Service struct {
	Q      *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
	logger *zap.Logger
}

// ErrMomentNotFound 是当备忘录不存在时返回的哨兵错误
var ErrMomentNotFound = errors.New("moment not found")

func NewService(q *repository.Queries, logger *zap.Logger) *Service {
	return &Service{Q: q, logger: logger}
}

func (s *Service) ListMomentsPaginated(ctx context.Context, cursor int64, limit int) ([]types.MomentResponse, *int64, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}

	// 只处理 cursor 字段为时间戳，其它时间字段不用动
	var cursorTs pgtype.Timestamp
	if cursor > 0 {
		t := time.UnixMilli(cursor).UTC()
		cursorTs.Scan(t)
	} else {
		cursorTs = pgtype.Timestamp{Valid: false}
	}

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

	// nextCursor 用时间戳
	var nextCursor *int64
	if hasNext && len(items) > 0 {
		last := items[len(items)-1]
		ts := last.CreatedAt.Time.UnixMilli()
		nextCursor = &ts
	}

	// 构建响应，包含附件信息
	var moments []types.MomentResponse
	for _, m := range items {
		// 获取每个 moment 的附件
		attachments, err := s.getMomentAttachments(ctx, m.ID)
		if err != nil {
			return nil, nil, err
		}

		moments = append(moments, types.MomentResponse{
			ID:          m.ID,
			Content:     m.Content,
			Attachments: attachments,
			UpdatedAt:   m.UpdatedAt.Time.Format(time.RFC3339),
			CreatedAt:   m.CreatedAt.Time.Format(time.RFC3339),
		})
	}

	return moments, nextCursor, nil
}

func (s *Service) CreateMoment(ctx context.Context, body types.CreateMomentBody) (types.MomentResponse, error) {
	if body.Content == "" {
		return types.MomentResponse{}, errors.New("name is required")
	}

	// 创建 moment
	newMoment, err := s.Q.CreateMoment(ctx, body.Content)
	if err != nil {
		return types.MomentResponse{}, errors.New("failed to create moment")
	}

	// 添加附件关联
	for _, attachmentRef := range body.AttachmentIDs {
		// 将字符串 ID 转换为 UUID
		var attachmentID pgtype.UUID
		if err := attachmentID.Scan(attachmentRef.AttachmentID); err != nil {
			return types.MomentResponse{}, errors.New("invalid attachment ID format")
		}

		err := s.Q.AddAttachmentToMoment(ctx, repository.AddAttachmentToMomentParams{
			MomentID:     newMoment.ID,
			AttachmentID: attachmentID,
			Position:     attachmentRef.Position,
		})
		if err != nil {
			// 如果添加附件失败，可以考虑回滚或记录错误
			return types.MomentResponse{}, errors.New("failed to add attachment to moment")
		}
	}

	// 获取创建的 moment 及其附件
	attachments, err := s.getMomentAttachments(ctx, newMoment.ID)
	if err != nil {
		return types.MomentResponse{}, errors.New("failed to get moment attachments")
	}

	return types.MomentResponse{
		ID:          newMoment.ID,
		Content:     newMoment.Content,
		Attachments: attachments,
		UpdatedAt:   newMoment.UpdatedAt.Time.Format(time.RFC3339),
		CreatedAt:   newMoment.CreatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *Service) GetMomentByID(ctx context.Context, id int64) (types.MomentResponse, error) {
	if err := s.checkMomentExists(ctx, id); err != nil {
		return types.MomentResponse{}, err
	}
	_moment, err := s.Q.GetMomentByID(ctx, id)
	if err != nil {
		return types.MomentResponse{}, err
	}

	// 获取附件信息
	attachments, err := s.getMomentAttachments(ctx, id)
	if err != nil {
		return types.MomentResponse{}, err
	}

	return types.MomentResponse{
		ID:          _moment.ID,
		Content:     _moment.Content,
		Attachments: attachments,
		UpdatedAt:   _moment.UpdatedAt.Time.Format(time.RFC3339),
		CreatedAt:   _moment.CreatedAt.Time.Format(time.RFC3339),
	}, nil
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

// getMomentAttachments 获取指定 moment 的所有附件信息
func (s *Service) getMomentAttachments(ctx context.Context, momentID int64) ([]types.Attachment, error) {
	attachmentRows, err := s.Q.GetMomentAttachmentsByID(ctx, momentID)
	if err != nil {
		return nil, err
	}

	var attachments []types.Attachment
	for _, row := range attachmentRows {
		// 将 pgtype.UUID 转换为字符串
		var idStr string
		if row.ID.Valid {
			// 使用 google/uuid 包将字节数组转换为 UUID 字符串
			id, err := uuid.FromBytes(row.ID.Bytes[:])
			if err != nil {
				continue // 跳过无效的 UUID
			}
			idStr = id.String()
		}

		attachments = append(attachments, types.Attachment{
			ID:           idStr,
			ObjectKey:    row.ObjectKey,
			OriginalName: row.OriginalName,
			MimeType:     row.MimeType,
			FileSize:     row.FileSize,
			Position:     row.Position,
		})
	}

	return attachments, nil
}

// AddAttachmentToMoment 向指定的 moment 添加附件
func (s *Service) AddAttachmentToMoment(ctx context.Context, momentID int64, attachmentID string, position int16) error {
	// 检查 moment 是否存在
	if err := s.checkMomentExists(ctx, momentID); err != nil {
		return ErrMomentNotFound
	}

	// 将字符串 ID 转换为 UUID
	var attachmentUUID pgtype.UUID
	if err := attachmentUUID.Scan(attachmentID); err != nil {
		s.logger.Sugar().Errorf("invalid attachment ID format: %v", err)

		return errors.New("invalid attachment ID format")
	}

	err := s.Q.AddAttachmentToMoment(ctx, repository.AddAttachmentToMomentParams{
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
	var attachmentUUID pgtype.UUID
	if err := attachmentUUID.Scan(attachmentID); err != nil {
		return errors.New("invalid attachment ID format")
	}

	return s.Q.RemoveAttachmentFromMoment(ctx, repository.RemoveAttachmentFromMomentParams{
		MomentID:     momentID,
		AttachmentID: attachmentUUID,
	})
}
