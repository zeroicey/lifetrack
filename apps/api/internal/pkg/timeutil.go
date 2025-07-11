package pkg

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func StringToPgTimestamp(s string) pgtype.Timestamp {
	if s == "" {
		return pgtype.Timestamp{Valid: false}
	}
	layout := "2006-01-02 15:04:05.999999 -07:00"
	t, err := time.Parse(layout, s)
	if err != nil {
		// 解析失败，按无 cursor 返回
		return pgtype.Timestamp{Valid: false}
	}
	var pgts pgtype.Timestamp
	if err := pgts.Scan(t); err != nil {
		// 理论不会错，这里兜底
		return pgtype.Timestamp{Valid: false}
	}
	pgts.Valid = true
	return pgts
}
