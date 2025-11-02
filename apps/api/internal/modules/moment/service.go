package moment

import (
	"context"
	"time"
)

type Service interface {
	Create(ctx context.Context, body CreateMomentRequest) (Moment, error)
	GetById(ctx context.Context, id int64) (Moment, error)
	List(ctx context.Context, cursor int64, limit int) ([]Moment, *int64, error)
}

type serviceImpl struct {
	R         Repository
	converter *Converter
}

func NewService(R Repository) Service {
	return &serviceImpl{R: R, converter: NewConverter()}
}

func (s *serviceImpl) Create(ctx context.Context, momentBody CreateMomentRequest, attachmentsBodies []CreateMomentAttachmentRequest) (Moment, error) {
	moment, err := s.R.Create(ctx, momentBody.Content)
	// for _, body := range attachmentsBodies {
	// 	ext := filepath.Ext(body.OriginalName)
	// 	objectKey := uuid.NewString() + ext
	// 	attachment, err := s.R.CreateAttachment(ctx, dao.CreateMomentAttachmentParams{
	// 		ObjectKey:    objectKey,
	// 		OriginalName: body.OriginalName,
	// 		MimeType:     body.MimeType,
	// 		FileSize:     body.FileSize,
	// 		Md5:          body.Md5,
	// 	})
	// 	if err != nil {
	// 		log.Fatalf("Something error")
	// 	}
	// }

	if err != nil {
		return Moment{}, err
	}

	return Moment{
		ID:        moment.ID,
		Content:   moment.Content,
		CreatedAt: moment.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt: moment.UpdatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *serviceImpl) GetById(ctx context.Context, id int64) (Moment, error) {
	moment, err := s.R.GetById(ctx, id)

	if err != nil {
		return Moment{}, err
	}

	return Moment{
		ID:        moment.ID,
		Content:   moment.Content,
		CreatedAt: moment.CreatedAt.Time.Format(time.RFC3339),
		UpdatedAt: moment.UpdatedAt.Time.Format(time.RFC3339),
	}, nil
}

func (s *serviceImpl) List(ctx context.Context, cursor int64, limit int) ([]Moment, *int64, error) {
	limit = func() int {
		if limit <= 0 {
			return 10
		}
		if limit > 100 {
			return 100
		}
		return limit
	}()

	_moments, err := s.R.List(ctx, dao.ListMomentsParams{
		Column1: s.converter.CursorToTimestamp(cursor),
		Limit:   int32(limit + 1),
	})

	if err != nil {
		return nil, nil, err
	}

	hasNext := len(_moments) > limit

	var items []dao.Moment
	if hasNext {
		items = _moments[:limit]
	} else {
		items = _moments
	}

	var nextCursor *int64
	if hasNext && len(items) > 0 {
		last := items[len(items)-1]
		ts := last.CreatedAt.Time.UnixMilli()
		nextCursor = &ts
	}

	moments, err := s.converter.ToMomentResponses(ctx, items)
	return moments, nextCursor, nil
}
