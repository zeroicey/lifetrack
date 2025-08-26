CREATE TABLE
    IF NOT EXISTS attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        object_key VARCHAR(1024) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        md5 VARCHAR(32) NOT NULL,
        file_size BIGINT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'uploading',
        CONSTRAINT chk_status CHECK (status IN ('uploading', 'completed')),
        created_at timestamptz NOT NULL DEFAULT NOW (),
        updated_at timestamptz NOT NULL DEFAULT NOW ()
    );

-- 只对 completed 状态的记录保持 object_key 唯一
CREATE UNIQUE INDEX idx_attachments_object_key_completed 
ON attachments (object_key) 
WHERE status = 'completed';

-- 为 uploading 状态的记录创建索引以提高查询性能
CREATE INDEX idx_attachments_status_uploading 
ON attachments (status, created_at) 
WHERE status = 'uploading';

-- 为 MD5 创建索引以提高重复文件检查性能
CREATE INDEX idx_attachments_md5_completed 
ON attachments (md5) 
WHERE status = 'completed';

CREATE TRIGGER attachments_updated_at_trigger BEFORE
UPDATE ON attachments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

COMMENT ON TABLE attachments IS '存储所有上传文件的元数据，如图片、视频、音频等';

COMMENT ON COLUMN attachments.id IS '附件的唯一标识符 (UUID)';

COMMENT ON COLUMN attachments.object_key IS '文件在 MinIO 中的唯一存储键 (路径/名称)';

COMMENT ON COLUMN attachments.original_name IS '文件的原始名称';

COMMENT ON COLUMN attachments.mime_type IS '文件的媒体类型 (e.g., image/jpeg)';

COMMENT ON COLUMN attachments.md5 IS '文件内容的 MD5 哈希值，用于验证文件完整性';

COMMENT ON COLUMN attachments.file_size IS '文件大小（字节）';

COMMENT ON COLUMN attachments.status IS '文件上传状态 (e.g., uploading, completed, failed)';

COMMENT ON COLUMN attachments.created_at IS '记录创建时间';

COMMENT ON COLUMN attachments.updated_at IS '记录最后更新时间';

-- 清理过期上传记录的函数
CREATE OR REPLACE FUNCTION cleanup_expired_uploads()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM attachments 
    WHERE status = 'uploading' 
    AND created_at < NOW() - INTERVAL '30 minutes';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 触发器函数：在插入新记录时自动清理过期记录
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_uploads()
RETURNS TRIGGER AS $$
BEGIN
    -- 异步清理过期记录，不影响当前插入操作
    PERFORM cleanup_expired_uploads();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：每次插入新的attachment记录时自动清理
CREATE TRIGGER auto_cleanup_expired_uploads
    AFTER INSERT ON attachments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_cleanup_expired_uploads();

-- 创建定期清理任务的注释说明
COMMENT ON FUNCTION cleanup_expired_uploads() IS '清理超过30分钟的上传记录，在每次上传请求时调用';