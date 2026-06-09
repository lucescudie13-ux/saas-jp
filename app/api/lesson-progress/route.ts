import { z } from "zod";
import { getAuthedContext } from "@/lib/api";
import { uuidSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

const schema = z.object({
  lessonId: uuidSchema,
  status: z.enum(["not_started", "in_progress", "completed"]).optional(),
  currentStep: z.number().int().min(1).max(6).optional(),
});

export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  const { lessonId, status, currentStep } = parsed.data;
  try {
    const { data, error } = await ctx.db
      .from("lesson_progress")
      .upsert(
        {
          user_id: ctx.user.id,
          lesson_id: lessonId,
          ...(status ? { status } : {}),
          ...(currentStep ? { current_step: currentStep } : {}),
          ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}),
        },
        { onConflict: "user_id,lesson_id" }
      )
      .select("*")
      .single();
    if (error) throw error;
    return ok(data);
  } catch {
    return serverError();
  }
}
