package pkg

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func StringToPgTimestamp(s string) pgtype.Timestamp {
	if s == "" {
		return pgtype.Timestamp{Valid: false}
	}
	// 修正 layout，支持时区名
	layout := "2006-01-02 15:04:05.000 -0700 MST"
	t, err := time.Parse(layout, s)
	if err != nil {
		return pgtype.Timestamp{Valid: false}
	}
	var pgts pgtype.Timestamp
	if err := pgts.Scan(t); err != nil {
		return pgtype.Timestamp{Valid: false}
	}
	pgts.Valid = true
	return pgts
}
