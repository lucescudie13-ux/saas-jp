import { z } from "zod";
import { jlptLevelSchema } from "@/lib/validations";

export const listQuerySchema = z.object({
  level: jlptLevelSchema.optional(),
});
