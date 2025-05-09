import { z } from "zod";

export const taskGroupCreateSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  userId: z
    .number({ message: "Group ID is required." })
    .int({ message: "Group ID must be an integer." })
    .positive({ message: "Group ID must be a positive integer." }),
});

export const taskCreateSchema = z.object({
  groupId: z
    .number({ message: "Group ID is required." })
    .int({ message: "Group ID must be an integer." })
    .positive({ message: "Group ID must be a positive integer." }),
  content: z.string().min(1, { message: "Content is required." }),
  deadline: z.preprocess((val) => {
    return new Date(val as string);
  }, z.date()),
});

export type TaskGroupCreate = z.infer<typeof taskGroupCreateSchema>;
export type TaskCreate = z.infer<typeof taskCreateSchema>;
