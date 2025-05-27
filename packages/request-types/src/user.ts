import { z } from "zod";
import { commonIdSchema } from "./common";

export const userIdSchema = commonIdSchema;

export const userCreateSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
