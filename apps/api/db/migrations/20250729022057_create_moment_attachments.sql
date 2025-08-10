-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    moment_attachments (
        id VARCHAR(36) PRIMARY KEY,
        moment_id BIGINT NOT NULL,
        file_id VARCHAR(36) NOT NULL,
        position INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        CONSTRAINT uk_moment_position UNIQUE (moment_id, position),
        CONSTRAINT fk_moment_attachments_moment FOREIGN KEY (moment_id) REFERENCES moments (id) ON DELETE CASCADE,
        CONSTRAINT fk_moment_attachments_file FOREIGN KEY (file_id) REFERENCES files (id) ON DELETE CASCADE
    );

CREATE INDEX idx_moment_attachments_moment_id ON moment_attachments (moment_id);

CREATE INDEX idx_moment_attachments_file_id ON moment_attachments (file_id);

CREATE INDEX idx_moment_attachments_position ON moment_attachments (position);

-- 表注释
COMMENT ON TABLE moment_attachments IS 'moment和文件的关联表，记录附件位置信息';

COMMENT ON COLUMN moment_attachments.id IS '关联记录的唯一标识符';

COMMENT ON COLUMN moment_attachments.moment_id IS '关联的moment ID';

COMMENT ON COLUMN moment_attachments.file_id IS '关联的文件ID';

COMMENT ON COLUMN moment_attachments.position IS '附件在moment中的显示位置';

COMMENT ON COLUMN moment_attachments.created_at IS '关联创建时间';

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS moment_attachments;

-- +goose StatementEnd