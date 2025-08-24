CREATE TABLE
    IF NOT EXISTS moment_attachments (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        moment_id BIGINT NOT NULL,
        attachment_id UUID NOT NULL,
        position SMALLINT NOT NULL,
        CONSTRAINT fk_moment FOREIGN KEY (moment_id) REFERENCES moments (id) ON DELETE CASCADE,
        CONSTRAINT fk_attachment FOREIGN KEY (attachment_id) REFERENCES attachments (id) ON DELETE RESTRICT
    );

COMMENT ON TABLE moment_attachments IS '连接 moments 和 attachments 的多对多联结表';

COMMENT ON COLUMN moment_attachments.moment_id IS '关联的 Moment ID';

COMMENT ON COLUMN moment_attachments.id IS '联结记录的唯一标识符';

COMMENT ON COLUMN moment_attachments.attachment_id IS '关联的附件 ID';

COMMENT ON COLUMN moment_attachments.position IS '附件在 Moment 中的显示顺序 (0-8)';

CREATE INDEX idx_moment_attachments_moment_id ON moment_attachments (moment_id);

CREATE INDEX idx_moment_attachments_attachment_id ON moment_attachments (attachment_id);