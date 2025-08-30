import http from "@/lib/http";
import type {
    PresignedUploadBody,
    PresignedUploadResponse,
} from "@/types/attachment";
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

export const apiGetPresignedURL = async (bodies: PresignedUploadBody[]) => {
    const res = await http
        .post<Response<PresignedUploadResponse[]>>("storage/presigned/upload", {
            json: bodies,
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

export const apiGetAttachmentCoverUrl = async (attachmentId: string) => {
    const res = await http
        .get<Response<{ url: string }>>(`storage/${attachmentId}/cover-url`)
        .json();
    return res.data;
};
