import http, { Response } from "@/lib/http";
import { MemoCreate } from "@lifetrack/request-types";
import { MemoSelect } from "@lifetrack/response-types";

export const getAllMemos = async () => {
  const res = await http.get<Response<MemoSelect[]>>("memo/memos").json();
  return res.data;
};
export const createMemo = async (data: MemoCreate) => {
  const res = await http
    .post<Response<MemoSelect>>("memo/memos", { json: data })
    .json();
  return res.data;
};
