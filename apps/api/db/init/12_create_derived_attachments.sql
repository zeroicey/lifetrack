CREATE TABLE derived_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    original_attachment_id UUID NOT NULL,
    object_key VARCHAR(1024) NOT NULL,
    representation_type VARCHAR(50) NOT NULL, -- 核心字段，标识派生类型
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    media_metadata JSONB, -- 如缩略图的尺寸
    CONSTRAINT fk_original_attachment FOREIGN KEY (original_attachment_id) REFERENCES attachments (id) ON DELETE CASCADE
);

CREATE INDEX idx_derived_attachments_original_id ON derived_attachments (original_attachment_id);

CREATE UNIQUE INDEX uix_derived_attachments_original_id_type ON derived_attachments (
    original_attachment_id,
    representation_type
);

COMMENT ON TABLE derived_attachments IS '存储原始附件的派生版本，如缩略图、转码视频等。';

COMMENT ON COLUMN derived_attachments.original_attachment_id IS '指向原始附件的ID。';

COMMENT ON COLUMN derived_attachments.representation_type IS '派生类型标识，如 "thumbnail_small", "video_cover", "audio_waveform"。';