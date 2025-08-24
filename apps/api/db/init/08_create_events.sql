CREATE TABLE
    IF NOT EXISTS events (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        place TEXT NOT NULL,
        description TEXT NOT NULL,
        start_time timestamptz NOT NULL,
        end_time timestamptz NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW (),
        updated_at timestamptz NOT NULL DEFAULT NOW ()
    );

CREATE TRIGGER events_updated_at_trigger BEFORE
UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

COMMENT ON COLUMN events.id IS '事件的唯一标识符';

COMMENT ON COLUMN events.name IS '事件的名称';

COMMENT ON COLUMN events.place IS '事件的地点';

COMMENT ON COLUMN events.description IS '事件的描述';

COMMENT ON COLUMN events.start_time IS '事件的开始时间';

COMMENT ON COLUMN events.end_time IS '事件的结束时间';

COMMENT ON COLUMN events.created_at IS '记录创建时间';

COMMENT ON COLUMN events.updated_at IS '记录最后更新时间';