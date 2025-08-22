-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        birthday DATE,
        avatar_base64 TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

-- 创建更新时间触发器函数（users 专用）
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 users 表创建触发器
CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at();

-- 创建索引
CREATE INDEX idx_users_email ON users(email);

-- 表注释
COMMENT ON TABLE users IS '用户表，存储用户基本信息';

-- 字段注释
COMMENT ON COLUMN users.id IS '主键，自增ID';
COMMENT ON COLUMN users.email IS '用户邮箱，唯一标识';
COMMENT ON COLUMN users.name IS '用户姓名';
COMMENT ON COLUMN users.password_hash IS '密码哈希值';
COMMENT ON COLUMN users.birthday IS '用户生日';
COMMENT ON COLUMN users.avatar_base64 IS '头像Base64编码数据';
COMMENT ON COLUMN users.bio IS '用户简介';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_users_email;
DROP FUNCTION IF EXISTS update_users_updated_at();
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
