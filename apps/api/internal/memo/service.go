package memo

import (
	"context"

	"github.com/zeroicey/lifetrack-api/internal/repository"
)

type Service struct {
	Q *repository.Queries // Q 是 sqlc 生成的 Queries 结构体实例
}

func NewService(q *repository.Queries) *Service {
	return &Service{Q: q}
}

// 查询全部
func (s *Service) ListMemos(ctx context.Context, quereis repository.ListMemosWithCursorParams) ([]repository.Memo, error) {
	return s.Q.ListMemosWithCursor(ctx, quereis)
}

// 创建新备忘录
func (s *Service) CreateMemo(ctx context.Context, memo repository.CreateMemoParams) (repository.Memo, error) {
	return s.Q.CreateMemo(ctx, memo)
}

func (s *Service) DeleteMemoByID(ctx context.Context, id int64) error {
	return s.Q.DeleteMemoByID(ctx, id)
}
