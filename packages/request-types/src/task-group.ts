import { z } from "zod";
import { userIdSchema } from "./user";

export const groupIdSchema = z
  .number({ message: "Group id is required." })
  .int({ message: "Group id must be an integer." })
  .positive({ message: "Group id must be a positive integer." });

export const nameSchema = z.string().min(1, { message: "Name is required." });

export const taskGroupCreateSchema = z.object({
  name: nameSchema,
  userId: userIdSchema,
});

export const taskGroupUpdateSchema = z.object({
  groupId: groupIdSchema,
  name: nameSchema,
});

export type TaskGroupCreate = z.infer<typeof taskGroupCreateSchema>;
export type TaskGroupUpdate = z.infer<typeof taskGroupUpdateSchema>;
