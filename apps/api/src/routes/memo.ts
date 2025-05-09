import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { memoCreateSchema } from "@lifetrack/request-types";
import { MemoService } from "@/services/memo";

export const MemoRouter = new Hono();

const memoService = new MemoService();

MemoRouter.get("/memos", async (c) => {
  const data = await memoService.getAllMemos();
  return Responder.success().setData(data).build(c);
});

MemoRouter.post("/memos", validater("json", memoCreateSchema), async (c) => {
  const body = c.req.valid("json");
  const data = await memoService.createMemo(body);
  return Responder.success().setData(data).build(c);
});
