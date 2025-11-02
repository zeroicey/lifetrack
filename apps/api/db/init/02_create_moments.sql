CREATE TABLE IF NOT EXISTS moments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moments_created_at_desc ON moments (created_at DESC);

COMMENT ON TABLE moments IS '核心动态信息表，存储用户发布的文本内容。';
COMMENT ON COLUMN moments.id IS '动态的唯一标识符（主键）。';
COMMENT ON COLUMN moments.content IS '动态的主要文本内容。';
COMMENT ON COLUMN moments.created_at IS '记录的创建时间戳（带时区）。';
COMMENT ON COLUMN moments.updated_at IS '记录的最后更新时间戳（带时区）。';

CREATE TRIGGER moments_updated_at_trigger
BEFORE UPDATE ON moments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS moment_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_key VARCHAR(1024) NOT NULL UNIQUE,
    cover_object_key VARCHAR(1024) UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    md5 VARCHAR(32) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moment_attachments_md5 ON moment_attachments (md5);

COMMENT ON TABLE moment_attachments IS '附件元数据表，记录上传文件的物理和逻辑信息。';
COMMENT ON COLUMN moment_attachments.id IS '附件的唯一标识符（UUID），作为主键。';
COMMENT ON COLUMN moment_attachments.object_key IS '文件在对象存储服务（如S3/MinIO）中的唯一路径/键。';
COMMENT ON COLUMN moment_attachments.cover_object_key IS '视频或文档等文件的封面图在对象存储中的唯一路径/键。';
COMMENT ON COLUMN moment_attachments.original_name IS '文件的原始名称，用于向用户展示。';
COMMENT ON COLUMN moment_attachments.mime_type IS '文件的MIME类型（如 image/jpeg），用于客户端正确渲染。';
COMMENT ON COLUMN moment_attachments.file_size IS '文件的字节大小。';
COMMENT ON COLUMN moment_attachments.md5 IS '文件的MD5哈希值，可用于文件完整性校验和快速去重。';
COMMENT ON COLUMN moment_attachments.completed IS '上传完成状态标记，TRUE表示文件已成功持久化到对象存储。';
COMMENT ON COLUMN moment_attachments.created_at IS '记录的创建时间戳（带时区）。';

CREATE TABLE IF NOT EXISTS moment_attachment_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    moment_id BIGINT NOT NULL,
    attachment_id UUID NOT NULL,
    position SMALLINT NOT NULL,
    CONSTRAINT fk_moment FOREIGN KEY (moment_id) REFERENCES moments (id) ON DELETE CASCADE,
    CONSTRAINT fk_attachment FOREIGN KEY (attachment_id) REFERENCES moment_attachments (id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_moment_attachment_links_moment_id_position ON moment_attachment_links (moment_id, position);
CREATE INDEX IF NOT EXISTS idx_moment_attachment_links_attachment_id ON moment_attachment_links (attachment_id);

COMMENT ON TABLE moment_attachment_links IS '动态与附件的多对多关联表，定义了附件在动态中的显示顺序。';
COMMENT ON COLUMN moment_attachment_links.id IS '关联记录的唯一标识符（主键）。';
COMMENT ON COLUMN moment_attachment_links.moment_id IS '关联的动态ID（外键，指向 moments.id）。';
COMMENT ON COLUMN moment_attachment_links.attachment_id IS '关联的附件ID（外键，指向 moment_attachments.id）。';
COMMENT ON COLUMN moment_attachment_links.position IS '附件在该动态中的显示顺序';

