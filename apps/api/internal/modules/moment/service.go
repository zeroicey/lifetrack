package moment

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	"github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
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

	// 其它时间字段保持字符串格式
	var moments []types.MomentResponse
	for _, m := range items {
		attachments, _ := pkg.UnmarshalJSONB[[]types.Attachment](m.Attachments)
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
	// 兜底 attachments
	if body.Attachments == nil {
		body.Attachments = []types.Attachment{}
	}
	// 校验 content 和 attachments 至少有一个
	if body.Content == "" && len(body.Attachments) == 0 {
		return types.MomentResponse{}, errors.New("content or attachments is required")
	}
	// 校验 attachments
	for _, attachment := range body.Attachments {
		if attachment.Type == "" || attachment.URL == "" {
			return types.MomentResponse{}, errors.New("invalid attachment")
		}
		if _, ok := types.AttachmentTypes[attachment.Type]; !ok {
			return types.MomentResponse{}, errors.New("attachment.type only supports image/audio/video")
		}
	}
	attachmentsJSONB, err := pkg.MarshalJSONB(body.Attachments)
	if err != nil {
		return types.MomentResponse{}, errors.New("failed to process attachments")
	}
	newMoment, err := s.Q.CreateMoment(ctx, repository.CreateMomentParams{
		Content:     body.Content,
		Attachments: attachmentsJSONB,
	})
	if err != nil {
		return types.MomentResponse{}, errors.New("failed to create moment")
	}
	return types.MomentResponse{
		ID:          newMoment.ID,
		Content:     newMoment.Content,
		Attachments: body.Attachments,
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

	attachments, _ := pkg.UnmarshalJSONB[[]types.Attachment](_moment.Attachments)
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
		return errors.New("moment not found")
	}
	return nil
}
