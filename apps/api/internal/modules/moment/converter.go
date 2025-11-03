package moment

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/db/dao"
)

func CursorToTimestamp(cursor int64) pgtype.Timestamp {
	var cursorTs pgtype.Timestamp
	if cursor > 0 {
		t := time.UnixMilli(cursor).UTC()
		cursorTs.Scan(t)
	} else {
		cursorTs = pgtype.Timestamp{Valid: false}
	}
	return cursorTs
}

func ToMomentResponse(ctx context.Context, moment *dao.Moment) (Moment, error) {
	return Moment{
		ID:        moment.ID,
		Content:   moment.Content,
		UpdatedAt: moment.UpdatedAt.Time.Format(time.RFC3339),
		CreatedAt: moment.CreatedAt.Time.Format(time.RFC3339),
	}, nil
}

// ToMomentResponses 批量转换数据库模型为响应模型
func ToMomentResponses(ctx context.Context, moments []dao.Moment) ([]Moment, error) {
	var responses []Moment
	for _, m := range moments {
		resp, err := ToMomentResponse(ctx, &m)
		if err != nil {
			return nil, err
		}
		responses = append(responses, resp)
	}
	return responses, nil
}
