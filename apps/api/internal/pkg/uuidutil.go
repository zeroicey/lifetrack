package pkg

import (
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

// PgUUIDToString 将 pgtype.UUID 转换为字符串
// 如果 UUID 无效或为空，返回空字符串
func PgUUIDToString(pgUUID pgtype.UUID) (string, error) {
	if !pgUUID.Valid {
		return "", nil
	}

	// 使用 google/uuid 包将字节数组转换为 UUID 字符串
	id, err := uuid.FromBytes(pgUUID.Bytes[:])
	if err != nil {
		return "", err
	}

	return id.String(), nil
}

// PgUUIDToStringOrEmpty 将 pgtype.UUID 转换为字符串
// 如果转换失败，返回空字符串而不是错误
func PgUUIDToStringOrEmpty(pgUUID pgtype.UUID) string {
	result, err := PgUUIDToString(pgUUID)
	if err != nil {
		return ""
	}
	return result
}

// UUIDToPgUUID 将 uuid.UUID 转换为 pgtype.UUID
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