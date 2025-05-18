import { Hono } from "hono";
import Responder from "@/middlewares/response";
import validater from "@/middlewares/validate";
import { memoCreateSchema } from "@lifetrack/request-types";
import { MemoService } from "@/services/memo";
import { z } from "zod";

export const MemoRouter = new Hono<Env>();

const memoService = new MemoService();

const memoQuerySchema = z.object({
  cursor: z
    .string()
    .transform((s) => (s ? +s : undefined))
    .optional(),
  limit: z
    .string()
    .transform((s) => (s ? +s : undefined))
    .optional(),
});

MemoRouter.get("/memos", validater("query", memoQuerySchema), async (c) => {
  const userId = c.var.userId;
  const { cursor, limit } = c.req.valid("query");
  const data = await memoService.getAllMemos(userId, +cursor, limit);
  return Responder.success().setData(data).build(c);
});

MemoRouter.post("/memos", validater("json", memoCreateSchema), async (c) => {
  const body = c.req.valid("json");
  const data = await memoService.createMemo(body);
  return Responder.success("Memo created successfully.")
    .setData(data)
    .setStatusCode(201)
    .build(c);
});

MemoRouter.delete(
  "/memos/:id",
  validater("param", z.object({ id: z.string().transform((s) => +s) })),
  async (c) => {
    const { id } = c.req.valid("param");
    await memoService.deleteMemo(id);
    return Responder.success("Memo deleted successfully.")
      .setStatusCode(204)
      .build(c);
  }
);

MemoRouter.put(
  "/memos/:id",
  validater("param", z.object({ id: z.string().transform((s) => +s) })),
  validater("json", memoCreateSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const data = await memoService.updateMemo(id, body);
    return Responder.success("Memo updated successfully.")
      .setData(data)
      .build(c);
  }
);
