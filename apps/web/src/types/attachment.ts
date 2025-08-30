export type PresignedUploadResponse = {
    attachment_id: string;
    upload_url?: string;
    cover_upload_url?: string;
    is_duplicate: boolean;
};

export type PresignedUploadBody = {
    file_name: string;
    mime_type: string;
    cover_ext: string;
    file_size: number;
    cover_md5: string;
    md5: string;
};
