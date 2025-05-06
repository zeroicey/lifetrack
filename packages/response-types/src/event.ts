import { events } from "@lifetrack/postgres-db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const eventSelectSchema = createSelectSchema(events);

export type EventSelect = z.infer<typeof eventSelectSchema>;
