import http, { Response } from "@/lib/http";
import { MemoCreate } from "@lifetrack/request-types";
import { MemoSelect } from "@lifetrack/response-types";

export const getMemos = async ({ cursor }: { cursor?: number }) => {
  const url = cursor ? `memo/memos?cursor=${cursor}` : `memo/memos`;
  const res = await http
    .get<
      Response<{
        items: MemoSelect[];
        nextCursor: number | null;
      }>
    >(url)
    .json();

  return {
    items: res.data?.items,
    nextCursor: res.data?.nextCursor,
  };
};
export const createMemo = async (data: MemoCreate) => {
  const res = await http
    .post<Response<MemoSelect>>("memo/memos", { json: data })
    .json();
  return res.data;
};
