import { z } from "zod";

export const commonNameSchema = z
  .string()
  .min(1, { message: "Name is required." });

export const commonIdSchema = (idName: string) => {
  return z.preprocess(
    (val) => {
      if (typeof val === "string" || typeof val === "number") {
        const num = Number(val);
        return isNaN(num) ? val : num;
      }
      return val;
    },
    z
      .number({ message: `${idName} is required.` })
      .int({ message: `${idName} must be an integer.` })
      .positive({ message: `${idName} must be a positive integer.` })
  );
};
