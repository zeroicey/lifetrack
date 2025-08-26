package moment

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/zeroicey/lifetrack-api/internal/modules/moment/types"
	"github.com/zeroicey/lifetrack-api/internal/repository"
)

// Converter 负责数据转换逻辑
type Converter struct {
	Q *repository.Queries
}

// NewConverter 创建一个新的转换器实例
func NewConverter(q *repository.Queries) *Converter {
	return &Converter{q}
}

// ToMomentResponse 将数据库模型转换为响应模型
func (c *Converter) ToMomentResponse(ctx context.Context, moment repository.Moment) (types.MomentResponse, error) {
	// 获取附件信息
	attachments, err := c.getMomentAttachments(ctx, moment.ID)
	if err != nil {
		return types.MomentResponse{}, err
	}

	return types.MomentResponse{
		ID:          moment.ID,
		Content:     moment.Content,
		Attachments: attachments,
		UpdatedAt:   moment.UpdatedAt.Time.Format(time.RFC3339),
		CreatedAt:   moment.CreatedAt.Time.Format(time.RFC3339),
	}, nil
}

// ToMomentResponses 批量转换数据库模型为响应模型
func (c *Converter) ToMomentResponses(ctx context.Context, moments []repository.Moment) ([]types.MomentResponse, error) {
	var responses []types.MomentResponse
	for _, m := range moments {
		resp, err := c.ToMomentResponse(ctx, m)
		if err != nil {
			return nil, err
		}
		responses = append(responses, resp)
	}
	return responses, nil
}

// getMomentAttachments 获取指定 moment 的所有附件信息
func (c *Converter) getMomentAttachments(ctx context.Context, momentID int64) ([]types.Attachment, error) {
	attachmentRows, err := c.Q.GetMomentAttachmentsByID(ctx, momentID)
	if err != nil {
		return nil, err
	}

	var attachments []types.Attachment
	for _, row := range attachmentRows {
		// 将 pgtype.UUID 转换为字符串
		idStr := row.ID.String()

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

// CursorToTimestamp 将游标转换为 pgtype.Timestamp
func (c *Converter) CursorToTimestamp(cursor int64) pgtype.Timestamp {
	var cursorTs pgtype.Timestamp
	if cursor > 0 {
		t := time.UnixMilli(cursor).UTC()
		cursorTs.Scan(t)
	} else {
		cursorTs = pgtype.Timestamp{Valid: false}
	}
	return cursorTs
}
