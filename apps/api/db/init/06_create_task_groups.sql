CREATE TYPE task_group_type AS ENUM ('day', 'week', 'month', 'year', 'custom');

CREATE TABLE
    IF NOT EXISTS task_groups (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type task_group_type NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (name)
    );

-- 为 task_groups 表创建触发器
CREATE TRIGGER task_groups_updated_at_trigger
    BEFORE UPDATE ON task_groups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE task_groups ADD CONSTRAINT check_name_format
CHECK (
    (type = 'year' AND name ~ '^\d{4}$') OR
    (type = 'month' AND name ~ '^\d{4}-\d{2}$') OR
    (type = 'week' AND name ~ '^\d{4}-W\d{2}$') OR
    (type = 'day' AND name ~ '^\d{4}-\d{2}-\d{2}$') OR
    (type = 'custom')
);

COMMENT ON TABLE task_groups IS '任务分组表，仅可保存年任务组(2025)，月任务组(2025-07)，周任务组(2025-W28)，日任务组(2025-07-14)';

COMMENT ON COLUMN task_groups.id IS '主键，自增ID';
COMMENT ON COLUMN task_groups.name IS '任务分组名称';
COMMENT ON COLUMN task_groups.description IS '任务分组描述';
COMMENT ON COLUMN task_groups.type IS '任务分组类型：day(日), week(周), month(月), year(年), custom(自定义)';
COMMENT ON COLUMN task_groups.created_at IS '创建时间';
COMMENT ON COLUMN task_groups.updated_at IS '更新时间';