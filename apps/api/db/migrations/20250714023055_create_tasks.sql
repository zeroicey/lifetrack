-- +goose Up
-- +goose StatementBegin
CREATE TYPE task_status AS ENUM ('todo', 'done', 'abandon');

CREATE TABLE
    IF NOT EXISTS tasks (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        group_id BIGINT NOT NULL REFERENCES task_groups (id) ON DELETE CASCADE,
        pos TEXT NOT NULL,
        content TEXT NOT NULL,
        description TEXT,
        status task_status NOT NULL DEFAULT 'todo',
        deadline TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (), 
        UNIQUE (group_id, pos)
    );

CREATE INDEX idx_tasks_group_pos ON tasks (group_id, pos);

-- 创建更新时间触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 tasks 表创建自动更新 updated_at 的触发器
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建父表更新触发器函数
CREATE OR REPLACE FUNCTION update_parent_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新父表 task_groups 的 updated_at
    UPDATE task_groups 
    SET updated_at = NOW() 
    WHERE id = COALESCE(NEW.group_id, OLD.group_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- 为 tasks 表创建父表更新触发器（INSERT, UPDATE, DELETE 时都更新父表）
CREATE TRIGGER update_task_groups_on_task_change
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW 
    EXECUTE FUNCTION update_parent_updated_at();

-- 表注释
COMMENT ON TABLE tasks IS '任务表，存储具体的任务信息';

-- 字段注释
COMMENT ON COLUMN tasks.id IS '主键，自增ID';
COMMENT ON COLUMN tasks.group_id IS '所属任务组ID，外键关联task_groups表';
COMMENT ON COLUMN tasks.pos IS '任务在组内的位置标识';
COMMENT ON COLUMN tasks.content IS '任务内容';
COMMENT ON COLUMN tasks.description IS '任务描述';
COMMENT ON COLUMN tasks.status IS '任务状态：todo(待办), done(完成), abandon(放弃)';
COMMENT ON COLUMN tasks.deadline IS '任务截止时间';
COMMENT ON COLUMN tasks.created_at IS '创建时间';
COMMENT ON COLUMN tasks.updated_at IS '更新时间';

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_task_groups_on_task_change ON tasks;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP FUNCTION IF EXISTS update_parent_updated_at();
DROP TABLE IF EXISTS tasks;
DROP TYPE IF EXISTS task_status;
-- +goose StatementEnd