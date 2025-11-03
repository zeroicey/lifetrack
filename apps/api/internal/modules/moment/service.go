package moment

import (
	"context"
	"fmt"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2/log"
	"github.com/google/uuid"
	"github.com/minio/minio-go/v7"
	"github.com/zeroicey/lifetrack-api/db/dao"
	"github.com/zeroicey/lifetrack-api/internal/config"
)

type Service interface {
	Create(ctx context.Context, body *CreateMomentRequest) ([]PresignedUploadResponse, error)
	GetById(ctx context.Context, id int64) (Moment, error)
	List(ctx context.Context, cursor int64, limit int) ([]Moment, *int64, error)
}

type serviceImpl struct {
	R      Repository
	Minio  *minio.Client
	Config *config.Config
}

func NewService(R Repository, Minio *minio.Client, Config *config.Config) Service {
	return &serviceImpl{R: R, Minio: Minio, Config: Config}
}

func (s *serviceImpl) Create(ctx context.Context, body *CreateMomentRequest) ([]PresignedUploadResponse, error) {
	fmt.Printf("body.Content: %v\n", body.Content)
	fmt.Printf("body.Attachments: %v\n", body.Attachments)
	moment, err := s.R.Create(ctx, body.Content)
	fmt.Printf("moment: %v\n", moment)

	if err != nil {
		return nil, err
	}

	responses := make([]PresignedUploadResponse, 0, len(body.Attachments))

	for _, attachmentBody := range body.Attachments {
		ext := filepath.Ext(attachmentBody.OriginalName)
		objectKey := uuid.NewString() + ext
		attachment, err := s.R.CreateAttachment(ctx, dao.CreateMomentAttachmentParams{
			ObjectKey:    objectKey,
			OriginalName: attachmentBody.OriginalName,
			MimeType:     attachmentBody.MimeType,
			FileSize:     attachmentBody.FileSize,
			Md5:          attachmentBody.Md5,
		})
		if err != nil {
			log.Fatalf("Something error")
		}

		expiry := time.Duration(s.Config.Storage.PresignedExpiry) * time.Minute
		presignedUrl, err := s.Minio.PresignedPutObject(ctx, s.Config.Storage.BucketName, objectKey, expiry)

		if err != nil {
			return nil, nil
		}

		responses = append(responses, PresignedUploadResponse{
			ObjectKey:   objectKey,
			UploadUrl:   presignedUrl.String(),
			IsDuplicate: false,
		})
		fmt.Printf("attachment: %v\n", attachment)
	}

	return responses, nil
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
		Column1: CursorToTimestamp(cursor),
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

	moments, err := ToMomentResponses(ctx, items)
	return moments, nextCursor, nil
}
