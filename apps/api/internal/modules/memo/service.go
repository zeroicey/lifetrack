package memo

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	memo "github.com/zeroicey/lifetrack-api/internal/modules/memo/types"
	"github.com/zeroicey/lifetrack-api/internal/pkg"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

func (s *Service) ListMemosPaginated(ctx context.Context, cursor int64, limit int) ([]memo.MemoResponse, *int64, error) {
	fmt.Printf("cursor: %v\n", cursor)
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

	fmt.Printf("cursorTs: %v\n", cursorTs)

	_memos, err := s.Q.ListMemosWithCursor(ctx, repository.ListMemosWithCursorParams{
		Column1: cursorTs,
		Limit:   int32(limit + 1),
	})
	if err != nil {
		return nil, nil, err
	}

	hasNext := len(_memos) > limit
	var items []repository.Memo
	if hasNext {
		items = _memos[:limit]
	} else {
		items = _memos
	}

	// nextCursor 用时间戳
	var nextCursor *int64
	if hasNext && len(items) > 0 {
		last := items[len(items)-1]
		ts := last.CreatedAt.Time.UnixMilli()
		nextCursor = &ts
	}

	// 其它时间字段保持字符串格式
	var memos []memo.MemoResponse
	for _, m := range items {
		attachments, _ := pkg.UnmarshalJSONB[[]memo.Attachment](m.Attachments)
		memos = append(memos, memo.MemoResponse{
			ID:          m.ID,
			Content:     m.Content,
			Attachments: attachments,
			UpdatedAt:   m.UpdatedAt.Time.Format(time.RFC3339),
			CreatedAt:   m.CreatedAt.Time.Format(time.RFC3339),
		})
	}

	return memos, nextCursor, nil
}

func (s *Service) CreateMemo(ctx context.Context, body memo.CreateMemoBody) (memo.MemoResponse, error) {
	// 兜底 attachments
	if body.Attachments == nil {
		body.Attachments = []memo.Attachment{}
	}
	// 校验 content
	if body.Content == "" {
		return memo.MemoResponse{}, errors.New("Content is required")
	}
	// 校验 attachments
	for _, attachment := range body.Attachments {
		if attachment.Type == "" || attachment.URL == "" {
			return memo.MemoResponse{}, errors.New("Invalid attachment")
		}
		if _, ok := memo.AttachmentTypes[attachment.Type]; !ok {
			return memo.MemoResponse{}, errors.New("attachment.type only supports image/audio/video")
		}
	}
	attachmentsJSONB, err := pkg.MarshalJSONB(body.Attachments)
	if err != nil {
		return memo.MemoResponse{}, errors.New("Failed to process attachments")
	}
	newMemo, err := s.Q.CreateMemo(ctx, repository.CreateMemoParams{
		Content:     body.Content,
		Attachments: attachmentsJSONB,
	})
	if err != nil {
		return memo.MemoResponse{}, errors.New("Failed to create memo")
	}
	return memo.MemoResponse{
		ID:          newMemo.ID,
		Content:     newMemo.Content,
		Attachments: body.Attachments,
		UpdatedAt:   newMemo.UpdatedAt.Time.String(),
		CreatedAt:   newMemo.CreatedAt.Time.String(),
	}, nil
}

func (s *Service) DeleteMemoByID(ctx context.Context, id int64) error {
	return s.Q.DeleteMemoByID(ctx, id)
}
