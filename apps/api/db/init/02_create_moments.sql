CREATE TABLE IF NOT EXISTS moments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content TEXT,
    created_at timestamptz DEFAULT NOW() NOT NULL,
    updated_at timestamptz DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_moments_created_at_desc ON moments (created_at DESC);

COMMENT ON TABLE moments IS '用于存储即使信息，包括文本内容和附件';

COMMENT ON COLUMN moments.id IS '备忘录的唯一标识符';

COMMENT ON COLUMN moments.content IS '备忘录的主要文本内容';

COMMENT ON COLUMN moments.created_at IS '记录创建时间';

COMMENT ON COLUMN moments.updated_at IS '记录最后更新时间';

CREATE TRIGGER moments_updated_at_trigger BEFORE
UPDATE ON moments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column ();