import http from "@/lib/http";
import type { PresignedUploadResponse } from "@/types/attachment";
import { calculateMD5 } from "@/utils/common";
import type { Response } from "@/lib/http";
import ky from "ky";
export const apiUploadAttachment = async ({
    url,
    file,
}: {
    url: string;
    file: File;
}) => {
    await ky
        .put(url, {
            body: file,
        })
        .json();
};

export const apiGetPresignedURL = async (file: File) => {
    const res = await http
        .post<Response<PresignedUploadResponse>>("storage/presigned/upload", {
            json: {
                fileName: file.name,
                fileSize: file.size,
                contentType: file.type,
                md5: await calculateMD5(file),
            },
        })
        .json();
    return res.data;
};

export const apiCompleteUpload = async (attachmentId: string) => {
    const res = await http.post(`storage/${attachmentId}/completed`);
    if (res.status !== 204) throw new Error("Failed to complete upload");
};

export const apiGetAttachmentUrl = async (attachmentId: string) => {
    const res = await http
        .get<Response<{ url: string }>>(`storage/${attachmentId}/url`)
        .json();
    return res.data;
};
