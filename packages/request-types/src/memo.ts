import { z } from "zod";
import { commonIdSchema } from "./common";

export const memoCreateSchema = z.object({
  content: z.string().min(1, { message: "Content is required." }),
});

export const memoUpdateSchema = memoCreateSchema.extend({
  id: commonIdSchema("Memo id"),
});

export type MemoCreate = z.infer<typeof memoCreateSchema>;
export type MemoUpdate = z.infer<typeof memoUpdateSchema>;
