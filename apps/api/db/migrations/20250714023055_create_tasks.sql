-- +goose Up
-- +goose StatementBegin
CREATE TYPE task_status AS ENUM ('todo', 'done', 'abandon');

CREATE TABLE
    IF NOT EXISTS tasks (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        group_id BIGINT NOT NULL REFERENCES task_groups (id) ON DELETE CASCADE,
        pos TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        status task_status NOT NULL DEFAULT 'todo',
        due_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

CREATE INDEX idx_tasks_group_pos ON tasks (group_id, pos);

-- +goose StatementEnd
-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS tasks;

DROP TYPE IF EXISTS task_status;

-- +goose StatementEnd