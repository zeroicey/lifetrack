CREATE TYPE task_status AS ENUM ('todo', 'done', 'abandon');

CREATE TABLE
    IF NOT EXISTS tasks (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        group_id BIGINT NOT NULL REFERENCES task_groups (id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        status task_status NOT NULL DEFAULT 'todo',
        deadline TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE TRIGGER tasks_updated_at_trigger BEFORE
UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_task_groups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE task_groups 
    SET updated_at = NOW() 
    WHERE id = COALESCE(NEW.group_id, OLD.group_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_groups_on_tasks_change
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW 
    EXECUTE FUNCTION update_task_groups_updated_at();

COMMENT ON TABLE tasks IS '任务表，存储具体的任务信息';

COMMENT ON COLUMN tasks.id IS '主键，自增ID';
COMMENT ON COLUMN tasks.group_id IS '所属任务组ID，外键关联task_groups表';
COMMENT ON COLUMN tasks.content IS '任务内容';
COMMENT ON COLUMN tasks.status IS '任务状态：todo(待办), done(完成), abandon(放弃)';
COMMENT ON COLUMN tasks.deadline IS '任务截止时间';
COMMENT ON COLUMN tasks.created_at IS '创建时间';
COMMENT ON COLUMN tasks.updated_at IS '更新时间';