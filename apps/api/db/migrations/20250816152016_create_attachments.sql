-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    IF NOT EXISTS attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        object_key VARCHAR(1024) NOT NULL UNIQUE,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        md5 VARCHAR(32) NOT NULL,
        file_size BIGINT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'uploading',
        CONSTRAINT chk_status CHECK (status IN ('uploading', 'completed', 'failed')),
        created_at timestamptz NOT NULL DEFAULT NOW ()
    );

-- 2. 为 attachments 表和列添加注释
COMMENT ON TABLE attachments IS '存储所有上传文件的元数据，如图片、视频、音频等';

COMMENT ON COLUMN attachments.id IS '附件的唯一标识符 (UUID)';

COMMENT ON COLUMN attachments.object_key IS '文件在 MinIO 中的唯一存储键 (路径/名称)';

COMMENT ON COLUMN attachments.original_name IS '文件的原始名称';

COMMENT ON COLUMN attachments.mime_type IS '文件的媒体类型 (e.g., image/jpeg)';

COMMENT ON COLUMN attachments.md5 IS '文件内容的 MD5 哈希值，用于验证文件完整性';

COMMENT ON COLUMN attachments.file_size IS '文件大小（字节）';

COMMENT ON COLUMN attachments.status IS '文件上传状态 (e.g., uploading, completed, failed)';

COMMENT ON COLUMN attachments.created_at IS '记录创建时间';

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS attachments;

-- +goose StatementEnd