import { event } from "@lifetrack/db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const eventSelectSchema = createSelectSchema(event.events);

export type EventSelect = z.infer<typeof eventSelectSchema>;
