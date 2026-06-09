import { z } from "zod";
import { getAuthedContext } from "@/lib/api";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

const schema = z.object({
  activity: z.enum(["vocab", "phrases", "grammar", "dialogue", "reading", "flashcards", "review"]),
  durationSeconds: z.number().int().min(0).max(60 * 60 * 6),
  itemsReviewed: z.number().int().min(0).optional().default(0),
  correct: z.number().int().min(0).optional().default(0),
  total: z.number().int().min(0).optional().default(0),
});

export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  const v = parsed.data;
  try {
    const { data, error } = await ctx.db
      .from("study_sessions")
      .insert({
        user_id: ctx.user.id,
        activity: v.activity,
        duration_seconds: v.durationSeconds,
        items_reviewed: v.itemsReviewed,
        correct: v.correct,
        total: v.total,
      })
      .select("*")
      .single();
    if (error) throw error;
    return ok(data);
  } catch {
    return serverError();
  }
}
