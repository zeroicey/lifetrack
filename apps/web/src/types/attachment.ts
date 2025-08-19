export type PresignedUploadResponse = {
    attachmentId: string;
    uploadUrl: string;
    objectKey: string;
    isDuplicate: boolean;
};
