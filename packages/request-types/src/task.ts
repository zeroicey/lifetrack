import { z } from "zod";

export const taskGroupCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  userId: z
    .number({ message: "User ID is required." })
    .int({ message: "User ID must be an integer." })
    .positive({ message: "User ID must be a positive integer." }),
});

export const taskCreateSchema = z.object({
  groupId: z
    .number({ message: "User ID is required." })
    .int({ message: "User ID must be an integer." })
    .positive({ message: "User ID must be a positive integer." }),
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.date({ message: "Deadline is required." }),
});

export type TaskGroupCreate = z.infer<typeof taskGroupCreateSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
