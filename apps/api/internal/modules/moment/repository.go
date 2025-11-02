package moment

import (
	"context"

	"github.com/zeroicey/lifetrack-api/db/dao"
)

type Repository interface {
	List(ctx context.Context, params dao.ListMomentsParams) ([]dao.Moment, error)
	Create(ctx context.Context, content string) (dao.Moment, error)
	CreateAttachment(ctx context.Context, params dao.CreateMomentAttachmentParams) (dao.MomentAttachment, error)
	GetById(ctx context.Context, id int64) (dao.Moment, error)
	DeleteById(ctx context.Context, id int64) error
}

type repoImpl struct {
	Q *dao.Queries
}

func NewRepository(Q *dao.Queries) Repository {
	return &repoImpl{Q: Q}
}

func (r *repoImpl) List(ctx context.Context, params dao.ListMomentsParams) ([]dao.Moment, error) {
	return r.Q.ListMoments(ctx, params)
}

func (r *repoImpl) Create(ctx context.Context, content string) (dao.Moment, error) {
	return r.Q.CreateMoment(ctx, content)
}

func (r *repoImpl) GetById(ctx context.Context, id int64) (dao.Moment, error) {
	return r.Q.GetMomentByID(ctx, id)
}

func (r *repoImpl) DeleteById(ctx context.Context, id int64) error {
	return r.Q.DeleteMomentByID(ctx, id)
}

func (r *repoImpl) CreateAttachment(ctx context.Context, params dao.CreateMomentAttachmentParams) (dao.MomentAttachment, error) {
	return r.Q.CreateMomentAttachment(ctx, params)
}
