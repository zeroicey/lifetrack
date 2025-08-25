CREATE TABLE
    IF NOT EXISTS habits (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at timestamptz NOT NULL DEFAULT NOW (),
        updated_at timestamptz NOT NULL DEFAULT NOW ()
    );

CREATE TRIGGER habits_updated_at_trigger BEFORE
UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();

COMMENT ON TABLE habits IS '习惯表';

COMMENT ON COLUMN habits.id IS '习惯的唯一标识符';

COMMENT ON COLUMN habits.name IS '习惯的名称';

COMMENT ON COLUMN habits.description IS '习惯的描述';

COMMENT ON COLUMN habits.created_at IS '记录创建时间';

COMMENT ON COLUMN habits.updated_at IS '记录最后更新时间';