export type Moment = {
    id: number;
    content: string;
    attachments: Attachment[];
    updated_at: string;
    created_at: string;
};

export type Attachment = {
    type: string;
    pos: number;
    url: string;
};

export type MomentCreate = {
    content?: string;
    attachments?: Attachment[];
};
