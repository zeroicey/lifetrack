import { memos } from "@lifetrack/postgres-db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const memoSelectSchema = createSelectSchema(memos).omit({ userId: true });

export type MemoSelect = z.infer<typeof memoSelectSchema>;
