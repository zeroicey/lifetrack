import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { memoCreateSchema } from "@lifetrack/request-types";
import { MemoService } from "@/services/memo";
import { z } from "zod";

export const MemoRouter = new Hono();

const memoService = new MemoService();

MemoRouter.get(
  "/memos",
  validater(
    "query",
    z.object({
      cursor: z
        .string()
        .transform((s) => (s ? +s : undefined))
        .optional(),
      limit: z
        .string()
        .transform((s) => (s ? +s : undefined))
        .optional(),
    })
  ),
  async (c) => {
    const { cursor, limit } = c.req.valid("query");
    const data = await memoService.getAllMemos(+cursor, limit);
    return Responder.success().setData(data).build(c);
  }
);

MemoRouter.post("/memos", validater("json", memoCreateSchema), async (c) => {
  const body = c.req.valid("json");
  const data = await memoService.createMemo(body);
  return Responder.success().setData(data).build(c);
});
