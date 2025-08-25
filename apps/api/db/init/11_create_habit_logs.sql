CREATE TABLE
    IF NOT EXISTS habit_logs (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        habit_id BIGINT NOT NULL REFERENCES habits (id) ON DELETE CASCADE,
        happened_at timestamptz NOT NULL DEFAULT NOW ()
    );

CREATE OR REPLACE FUNCTION update_habits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE habits 
    SET updated_at = NOW() 
    WHERE id = COALESCE(NEW.habit_id, OLD.habit_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_habits_on_habit_logs_change
    AFTER INSERT OR UPDATE OR DELETE ON habit_logs
    FOR EACH ROW 
    EXECUTE FUNCTION update_habits_updated_at();

COMMENT ON TABLE habit_logs IS '习惯日志表';

COMMENT ON COLUMN habit_logs.id IS '习惯日志的唯一标识符';

COMMENT ON COLUMN habit_logs.habit_id IS '习惯的唯一标识符';

COMMENT ON COLUMN habit_logs.happened_at IS '发生时间';