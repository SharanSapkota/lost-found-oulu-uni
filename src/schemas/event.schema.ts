import { z } from "zod";
import { EventType } from "../constants/enums";
export const createEventSchema = z.object({
  name: z.string().min(2, "Event name is required"),
  type: z.nativeEnum(EventType),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  config: z
    .object({
      requirePhoto: z.boolean().optional(),
      itemExpiryDays: z.number().int().positive().optional(),
      notifyOnClaim: z.boolean().optional(),
      primaryColor: z.string().optional(),
      logoUrl: z.string().url().optional(),
    })
    .optional(),
});

export const updateEventSchema = createEventSchema.partial();