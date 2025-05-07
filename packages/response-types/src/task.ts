import { taskGroups, tasks } from "@lifetrack/postgres-db";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const taskGroupSelectSchema = createSelectSchema(taskGroups);

const taskSelectSchema = createSelectSchema(tasks);

export type TaskGroupSelect = z.infer<typeof taskGroupSelectSchema>;
export type TaskSelect = z.infer<typeof taskSelectSchema>;
