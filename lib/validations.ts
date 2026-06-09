import { z } from "zod";
import { ITEM_TYPES, JLPT_LEVELS, SRS_RATINGS } from "@/lib/constants";

export const jlptLevelSchema = z.enum(JLPT_LEVELS);
export const itemKindSchema = z.enum(ITEM_TYPES);
export const srsRatingSchema = z.enum(SRS_RATINGS);
export const uuidSchema = z.string().uuid();
