import { z } from "zod";
import { commonIdSchema, commonNameSchema } from "./common";

export const linkIdSchema = commonIdSchema("Link id");

export const linkCreateSchema = z.object({
  name: commonNameSchema,
  target: z
    .string()
    .url({ message: "Target must be a valid URL." })
    .min(1, { message: "Target is required." }),
});

export const linkUpdateSchema = z.object({
  name: commonNameSchema,
  target: z
    .string()
    .url({ message: "Target must be a valid URL." })
    .min(1, { message: "Target is required." }),
});

export type LinkCreate = z.infer<typeof linkCreateSchema>;
export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
