-- +goose Up
-- +goose StatementBegin
ALTER TABLE memos
    ALTER COLUMN created_at TYPE TIMESTAMPTZ USING created_at::timestamptz,
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at TYPE TIMESTAMPTZ USING updated_at::timestamptz,
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE memos
    ALTER COLUMN created_at TYPE TIMESTAMP(3) USING created_at::timestamp(3),
    ALTER COLUMN created_at SET DEFAULT NOW(),
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at TYPE TIMESTAMP(3) USING updated_at::timestamp(3),
    ALTER COLUMN updated_at SET DEFAULT NOW(),
    ALTER COLUMN updated_at SET NOT NULL;
-- +goose StatementEnd
