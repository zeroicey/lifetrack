import http from "@/lib/http";
import type { PresignedUploadRequest } from "@/types/moment";
import { calculateMD5 } from "@/utils/common";
import type { Response } from "@/lib/http";
export const apiUploadAttachment = async ({
    url,
    file,
}: {
    url: string;
    file: File;
}) => {
    const res = await http
        .post(url, {
            body: file,
        })
        .json();
    console.log(res);
};

export const apiGetPresignedURL = async (file: File) => {
    const res = await http
        .post<Response<PresignedUploadRequest>>("/presigned/upload", {
            json: {
                fileName: file.name,
                fileSize: file.size,
                contentType: file.type,
                md5: calculateMD5(file),
            },
        })
        .json();
    return res.data;
};

export const apiCompleteUpload = async (attachmentId: string) => {
    const res = await http.post(`/storage/${attachmentId}/completed`);
    if (res.status !== 204) throw new Error("Failed to complete upload");
};

export const apiGetAttachmentUrl = async (attachmentId: string) => {
    const res = await http
        .post<Response<{ url: string }>>(`/storage/${attachmentId}/url`)
        .json();
    return res.data;
};
