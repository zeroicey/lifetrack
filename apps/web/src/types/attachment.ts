export type PresignedUploadResponse = {
    attachment_id: string;
    upload_url?: string;
    object_key: string;
    is_duplicate: boolean;
};
