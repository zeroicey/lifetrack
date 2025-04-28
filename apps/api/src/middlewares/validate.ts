import { ZodSchema } from "zod";
import { ValidationTargets } from "hono";
import { validator } from "hono/validator";
import Responder from "./response";

export default function validater(
  target: keyof ValidationTargets,
  schema: ZodSchema,
  message: string = "Invalid request body"
) {
  return validator(target, (value, c) => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return Responder.fail(message).setErrors(parsed.error.errors).build(c);
    }
    return parsed.data;
  });
}
