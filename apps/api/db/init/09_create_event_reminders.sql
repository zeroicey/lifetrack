CREATE TABLE
    IF NOT EXISTS event_reminders (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        event_id BIGINT NOT NULL REFERENCES events (id) ON DELETE CASCADE,
        remind_before INTEGER NOT NULL,
        notified BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

COMMENT ON TABLE event_reminders IS '事件提醒表';

COMMENT ON COLUMN event_reminders.id IS '主键，自增ID';

COMMENT ON COLUMN event_reminders.event_id IS '关联的事件ID';

COMMENT ON COLUMN event_reminders.remind_before IS '提醒前的时间间隔（单位：分）';

COMMENT ON COLUMN event_reminders.notified IS '是否已通知';

COMMENT ON COLUMN event_reminders.created_at IS '创建时间';