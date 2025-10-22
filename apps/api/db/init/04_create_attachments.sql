CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    object_key VARCHAR(1024) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    md5 VARCHAR(32) NOT NULL,
    media_metadata JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'uploading',
    CONSTRAINT chk_status CHECK (
        status IN (
            'uploading',
            'completed',
            'failed'
        )
    ),
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- 只对 completed 状态的记录保持 object_key 唯一
CREATE UNIQUE INDEX idx_attachments_object_key_completed ON attachments (object_key)
WHERE
    status = 'completed';

-- 为 uploading 状态的记录创建索引以提高查询性能
CREATE INDEX idx_attachments_status_uploading ON attachments (status, created_at)
WHERE
    status = 'uploading';

-- 为 MD5 创建索引以提高重复文件检查性能
CREATE INDEX idx_attachments_md5_completed ON attachments (md5)
WHERE
    status = 'completed';

CREATE TRIGGER attachments_updated_at_trigger BEFORE
UPDATE ON attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

COMMENT ON TABLE attachments IS '存储上传的原始文件元数据。';

COMMENT ON COLUMN attachments.id IS '文件的唯一标识符 (UUID)。';

COMMENT ON COLUMN attachments.object_key IS '文件在对象存储中的唯一键。';

COMMENT ON COLUMN attachments.mime_type IS '文件的媒体类型，用于客户端判断如何渲染。';

COMMENT ON COLUMN attachments.md5 IS '用于文件校验和去重。';

COMMENT ON COLUMN attachments.status IS '文件上传状态，用于管理未完成的上传。';

COMMENT ON COLUMN attachments.media_metadata IS '存储特定媒体的元数据，如 { "duration": 120, "width": 1920, "height": 1080 }。';