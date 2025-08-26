package pkg

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

func UUIDToPgUUID(id uuid.UUID) pgtype.UUID {
	return pgtype.UUID{Bytes: id, Valid: true}
}

// StringToPgUUID 将字符串转换为 pgtype.UUID
func StringToPgUUID(idStr string) (pgtype.UUID, error) {
	var pgUUID pgtype.UUID
	if err := pgUUID.Scan(idStr); err != nil {
		return pgUUID, err
	}
	return pgUUID, nil
}
