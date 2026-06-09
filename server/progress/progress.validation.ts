import { z } from "zod";
import { itemKindSchema, srsRatingSchema, uuidSchema } from "@/lib/validations";

export const reviewInputSchema = z.object({
  kind: itemKindSchema,
  itemId: uuidSchema,
  rating: srsRatingSchema,
});

export type ReviewInputSchema = z.infer<typeof reviewInputSchema>;
