import { z } from "zod";
import { groupIdSchema } from "./task-group";
import { userIdSchema } from "./user";

export const taskIdSchema = z
  .number({ message: "Task id is required." })
  .int({ message: "Task id must be an integer." })
  .positive({ message: "Task id must be a positive integer." });

export const taskCreateSchema = z.object({
  groupId: groupIdSchema,
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.preprocess((val) => {
    return new Date(val as string);
  }, z.date()),
});

export const taskUpdateSchema = z.object({
  userId: userIdSchema,
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.preprocess((val) => {
    return new Date(val as string);
  }, z.date()),
});

export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;
