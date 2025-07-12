-- +goose Up
-- 1. 把所有 attachments = '[{}]' 的数据批量替换为 '[]'
UPDATE memos SET attachments = '[]' WHERE attachments = '[{}]';

-- 2. 修改默认值为 '[]'
ALTER TABLE memos ALTER COLUMN attachments SET DEFAULT '[]';

-- +goose Down
-- 恢复默认值为 '[{}]'
UPDATE memos SET attachments = '[{}]' WHERE attachments = '[]';
ALTER TABLE memos ALTER COLUMN attachments SET DEFAULT '[{}]';
