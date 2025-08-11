-- +goose Up
-- +goose StatementBegin
-- 创建文件状态枚举类型
CREATE TYPE file_status AS ENUM ('uploading', 'completed', 'failed', 'deleted');

-- 创建文件类型枚举类型
CREATE TYPE file_type AS ENUM ('image', 'audio', 'video');

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- 自动生成 UUID
    object_key VARCHAR(500) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_md5 VARCHAR(32),
    type file_type NOT NULL,
    status file_status DEFAULT 'uploading',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_files_object_key ON files(object_key);
CREATE INDEX idx_files_type ON files(type);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_created_at ON files(created_at);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_files_updated_at 
    BEFORE UPDATE ON files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 表和字段注释
COMMENT ON TABLE files IS '文件信息表，存储上传到对象存储的文件元数据';
COMMENT ON COLUMN files.id IS '文件唯一标识符，自动生成的UUID';
COMMENT ON COLUMN files.type IS '文件类型：image(图片), audio(音频), video(视频)';
COMMENT ON COLUMN files.status IS '文件状态：uploading(上传中), completed(完成), failed(失败), deleted(已删除)';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_files_updated_at ON files;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS files;
DROP TYPE IF EXISTS file_status;
DROP TYPE IF EXISTS file_type;
-- +goose StatementEnd
