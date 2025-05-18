import { users } from "@lifetrack/postgres-db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const userSelectSchema = createSelectSchema(users).omit({ password: true });

export type UserSelect = z.infer<typeof userSelectSchema>;
