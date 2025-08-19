export type Moment = {
    id: number;
    content: string;
    attachments: MomentAttachment[] | null;
    updated_at: string;
    created_at: string;
};

export type MomentAttachment = {
    id: string;
    object_key: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    position: number;
};

export type MomentCreate = {
    content: string;
};
