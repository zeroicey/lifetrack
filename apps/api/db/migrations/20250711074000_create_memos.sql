-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS memos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP(3) NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE memos IS '用于存储备忘录信息，包括文本内容和附件';
COMMENT ON COLUMN memos.id IS '备忘录的唯一标识符';
COMMENT ON COLUMN memos.content IS '备忘录的主要文本内容';
COMMENT ON COLUMN memos.attachments IS '附件信息，以 JSONB 格式存储，例如：[{"type": "image", "url": "..."}]';
COMMENT ON COLUMN memos.created_at IS '记录创建时间';
COMMENT ON COLUMN memos.updated_at IS '记录最后更新时间';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS memos;
-- +goose StatementEnd
