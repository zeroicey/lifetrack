-- +goose Up
-- +goose StatementBegin
CREATE TYPE task_group_type AS ENUM ('day', 'week', 'month', 'year', 'custom');

-- 创建 task_groups 表，包含 type 字段
CREATE TABLE
    IF NOT EXISTS task_groups (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type task_group_type NOT NULL, -- 任务分组类型
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        UNIQUE (name)
    );

-- 表注释
COMMENT ON TABLE task_groups IS '任务分组表，仅可保存年任务组(2025)，月任务组(2025-07)，周任务组(2025-W28)，日任务组(2025-07-14)';

-- 字段注释
COMMENT ON COLUMN task_groups.id IS '主键，自增ID';

COMMENT ON COLUMN task_groups.name IS '任务分组名称';

COMMENT ON COLUMN task_groups.description IS '任务分组描述';

COMMENT ON COLUMN task_groups.type IS '任务分组类型：day(日), week(周), month(月), year(年), custom(自定义)';

COMMENT ON COLUMN task_groups.created_at IS '创建时间';

COMMENT ON COLUMN task_groups.updated_at IS '更新时间';

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS task_groups;

DROP TYPE IF EXISTS task_group_type;

-- +goose StatementEnd