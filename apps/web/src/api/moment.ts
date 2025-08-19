import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type { Moment, MomentCreate } from "@/types/moment";

export const apiGetMoments = async ({ cursor }: { cursor?: number }) => {
    const url = cursor ? `moments?cursor=${cursor}` : `moments`;
    const res = await http
        .get<
            Response<{
                items: Moment[];
                nextCursor: number | null;
            }>
        >(url)
        .json();

    return {
        items: res.data?.items,
        nextCursor: res.data?.nextCursor,
    };
};

export const apiCreateMoment = async ({ content }: MomentCreate) => {
    const res = await http
        .post<Response<Moment>>("moments", {
            json: { content },
        })
        .json();
    return res.data;
};

export const apiAddAttachmentToMoment = async ({
    momentId,
    attachment_id,
    position,
}: {
    momentId: number;
    attachment_id: string;
    position: number;
}) => {
    const res = await http
        .post<Response<null>>(`moments/${momentId}/attachments`, {
            json: { attachment_id, position },
        })
        .json();
    return res.data;
};

export const apiDeleteMoment = async (id: number) => {
    const res = await http.delete<Response<null>>(`moments/${id}`).json();
    return res.data;
};
