import { z } from "zod";
import { userIdSchema } from "./user";

export const groupIdSchema = z.preprocess((val) => {
  if (typeof val === "string" || typeof val === "number") {
    const num = Number(val);
    return isNaN(num) ? val : num;
  }
  return val;
}, z.number({ message: "Group id is required." }).int({ message: "Group id must be an integer." }).positive({ message: "Group id must be a positive integer." }));

export const nameSchema = z.string().min(1, { message: "Name is required." });

export const taskGroupCreateSchema = z.object({
  name: nameSchema,
  userId: userIdSchema,
});

export const taskGroupUpdateSchema = z.object({
  groupId: groupIdSchema,
  name: nameSchema,
});

// ==================================== //

export const taskIdSchema = z.preprocess((val) => {
  if (typeof val === "string" || typeof val === "number") {
    const num = Number(val);
    return isNaN(num) ? val : num;
  }
  return val;
}, z.number({ message: "Task id is required." }).int({ message: "Task id must be an integer." }).positive({ message: "Task id must be a positive integer." }));

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

export type TaskGroupCreate = z.infer<typeof taskGroupCreateSchema>;
export type TaskGroupUpdate = z.infer<typeof taskGroupUpdateSchema>;
