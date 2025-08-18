export type Moment = {
    id: number;
    content: string;
    updated_at: string;
    created_at: string;
};

export type MomentCreate = {
    content: string;
};

export type PresignedUploadRequest = {
    fileName: string;
    fileSize: number;
    contentType: string;
    md5: string;
};
