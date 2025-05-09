import { z } from "zod";

export const memoCreateSchema = z.object({
  content: z.string().min(1, { message: "Content is required." }),
  userId: z
    .number({ message: "User ID is required." })
    .int({ message: "User ID must be an integer." })
    .positive({ message: "User ID must be a positive integer." }),
});

export type MemoCreate = z.infer<typeof memoCreateSchema>;
