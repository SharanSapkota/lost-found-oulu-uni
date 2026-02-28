import { z } from "zod";

export const submitClaimSchema = z.object({
  claimerName: z.string().min(2, "Name is required"),
  claimerContact: z.string().min(5, "Contact is required"),
  ownershipProof: z
    .string()
    .min(10, "Please describe something only the owner would know"),
});

export const reviewClaimSchema = z.object({
  adminNote: z.string().optional(),
});