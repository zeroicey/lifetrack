import { z } from "zod";
import { commonIdSchema, commonNameSchema } from "./common";

export const linkCreateSchema = z.object({
  name: commonNameSchema,
  target: z
    .string()
    .url({ message: "Target must be a valid URL." })
    .min(1, { message: "Target is required." }),
});

export const linkUpdateSchema = z.object({
  id: commonIdSchema("Link id"),
  name: commonNameSchema,
  target: z
    .string()
    .url({ message: "Target must be a valid URL." })
    .min(1, { message: "Target is required." }),
});

export type LinkCreate = z.infer<typeof linkCreateSchema>;
export type LinkUpdate = z.infer<typeof linkUpdateSchema>;
