import { z } from "zod";

export const EventCreateSchema = z.object({
  content: z.string().min(1, { message: "Content is required." }),
  partyId: z
    .number({ message: "Party ID is required." })
    .int({ message: "Party ID must be an integer." })
    .positive({ message: "Party ID must be a positive integer." }),
});

export type EventCreate = z.infer<typeof EventCreateSchema>;
