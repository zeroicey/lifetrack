-- +goose Up
-- 1. 先把为NULL的数据填充默认值
UPDATE memos SET attachments = '[{}]' WHERE attachments IS NULL;

-- 2. 修改字段：NOT NULL + DEFAULT '[{}]'
ALTER TABLE memos
    ALTER COLUMN attachments SET NOT NULL,
    ALTER COLUMN attachments SET DEFAULT '[{}]';

-- +goose Down
ALTER TABLE memos
    ALTER COLUMN attachments DROP NOT NULL,
    ALTER COLUMN attachments DROP DEFAULT;
