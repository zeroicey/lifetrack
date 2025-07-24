import type { Response } from "@/lib/http";
import http from "@/lib/http";
import type { Moment } from "@/types/moment";

export const apiGetMoments = async ({ cursor }: { cursor?: number }) => {
    const url = cursor ? `moments&cursor=${cursor}` : `moments`;
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
