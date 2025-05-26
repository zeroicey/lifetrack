import { z } from "zod";

export const userIdSchema = z
  .number({ message: "User id is required." })
  .int({ message: "User id must be an integer." })
  .positive({ message: "User id must be a positive integer." });

export const userCreateSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
