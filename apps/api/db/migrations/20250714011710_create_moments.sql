-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS moments (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content      TEXT                     NOT NULL,
    attachments  JSONB    DEFAULT '[]'::JSONB NOT NULL,
    created_at   timestamptz DEFAULT NOW() NOT NULL,
    updated_at   timestamptz DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE moments IS '用于存储即使信息，包括文本内容和附件';

COMMENT ON COLUMN moments.id          IS '备忘录的唯一标识符';
COMMENT ON COLUMN moments.content     IS '备忘录的主要文本内容';
COMMENT ON COLUMN moments.attachments IS '附件信息，以 JSONB 格式存储，例如：[{"type": "image", "url": "..."}]';
COMMENT ON COLUMN moments.created_at  IS '记录创建时间';
COMMENT ON COLUMN moments.updated_at  IS '记录最后更新时间';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS moments;
-- +goose StatementEnd
