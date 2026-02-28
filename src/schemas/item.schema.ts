import { z } from "zod";
import { Category } from "../constants/enums";

export const uploadItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  category: z.nativeEnum(Category),
  locationFound: z.string().min(2, "Location is required"),
});

export const updateItemSchema = uploadItemSchema.partial();