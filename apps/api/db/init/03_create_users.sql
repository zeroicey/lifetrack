CREATE TABLE
    IF NOT EXISTS users (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        birthday DATE,
        avatar_base64 TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TRIGGER users_updated_at_trigger BEFORE
UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

CREATE INDEX idx_users_email ON users (email);

COMMENT ON TABLE users IS '用户表，存储用户基本信息';

COMMENT ON COLUMN users.id IS '主键，自增ID';

COMMENT ON COLUMN users.email IS '用户邮箱，唯一标识';

COMMENT ON COLUMN users.name IS '用户姓名';

COMMENT ON COLUMN users.password_hash IS '密码哈希值';

COMMENT ON COLUMN users.birthday IS '用户生日';

COMMENT ON COLUMN users.avatar_base64 IS '头像Base64编码数据';

COMMENT ON COLUMN users.bio IS '用户简介';

COMMENT ON COLUMN users.created_at IS '创建时间';

COMMENT ON COLUMN users.updated_at IS '更新时间';