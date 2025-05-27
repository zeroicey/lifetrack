import { z } from "zod";
import { commonIdSchema, commonNameSchema } from "./common";

export const taskGroupIdSchema = commonIdSchema("Task group id");

export const taskGroupCreateSchema = z.object({
  name: commonNameSchema,
});

export const taskGroupUpdateSchema = z.object({
  groupId: taskGroupIdSchema,
  name: commonNameSchema,
});

// ==================================== //

export const taskIdSchema = commonIdSchema("Task id");

export const taskCreateSchema = z.object({
  groupId: taskGroupIdSchema,
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.preprocess((val) => {
    return new Date(val as string);
  }, z.date()),
});

export const taskUpdateSchema = z.object({
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.preprocess((val) => {
    return new Date(val as string);
  }, z.date()),
});

export type TaskCreate = z.infer<typeof taskCreateSchema>;
export type TaskUpdate = z.infer<typeof taskUpdateSchema>;

export type TaskGroupCreate = z.infer<typeof taskGroupCreateSchema>;
export type TaskGroupUpdate = z.infer<typeof taskGroupUpdateSchema>;
