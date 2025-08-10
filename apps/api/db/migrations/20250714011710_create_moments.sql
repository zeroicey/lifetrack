-- +goose Up
-- +goose StatementBegin

-- 1. 创建 moments 表
CREATE TABLE
    IF NOT EXISTS moments (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        content TEXT NOT NULL,
        created_at timestamptz DEFAULT NOW () NOT NULL,
        updated_at timestamptz DEFAULT NOW () NOT NULL
    );

-- 2. 为表和列添加注释
COMMENT ON TABLE moments IS '用于存储即使信息，包括文本内容和附件';
COMMENT ON COLUMN moments.id IS '备忘录的唯一标识符';
COMMENT ON COLUMN moments.content IS '备忘录的主要文本内容';
COMMENT ON COLUMN moments.created_at IS '记录创建时间';
COMMENT ON COLUMN moments.updated_at IS '记录最后更新时间';

-- 3. 创建用于自动更新 updated_at 的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. 在 moments 表上创建触发器
CREATE TRIGGER moments_updated_at_trigger
BEFORE UPDATE ON moments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin

-- 1. 删除 moments 表（这将自动删除 moments_updated_at_trigger 触发器）
DROP TABLE IF EXISTS moments;

-- 2. 删除触发器函数，保持数据库清洁
DROP FUNCTION IF EXISTS update_updated_at_column();

-- +goose StatementEnd
