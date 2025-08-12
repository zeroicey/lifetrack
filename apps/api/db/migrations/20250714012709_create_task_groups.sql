-- +goose Up
-- +goose StatementBegin
CREATE TABLE
    IF NOT EXISTS task_groups (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (name)
    );

-- 创建更新时间触发器函数（task_groups 专用）
CREATE OR REPLACE FUNCTION update_task_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- 为 task_groups 表创建触发器
CREATE TRIGGER task_groups_updated_at_trigger
    BEFORE UPDATE ON task_groups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_task_groups_updated_at();

-- 表注释
COMMENT ON TABLE task_groups IS '任务分组表';

-- 字段注释
COMMENT ON COLUMN task_groups.id IS '主键，自增ID';

COMMENT ON COLUMN task_groups.name IS '任务分组名称';

COMMENT ON COLUMN task_groups.description IS '任务分组描述';

COMMENT ON COLUMN task_groups.created_at IS '创建时间';

COMMENT ON COLUMN task_groups.updated_at IS '更新时间';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS task_groups_updated_at_trigger ON task_groups;
DROP TABLE IF EXISTS task_groups;
DROP TYPE IF EXISTS task_group_type;
DROP FUNCTION IF EXISTS update_task_groups_updated_at();
-- +goose StatementEnd