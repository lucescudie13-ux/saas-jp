import { z } from "zod";
import { getAuthedContext } from "@/lib/api";
import { itemKindSchema, uuidSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

const schema = z.object({
  kind: itemKindSchema,
  itemId: uuidSchema,
  sentence: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  try {
    const { data, error } = await ctx.db
      .from("sentence_submissions")
      .insert({
        user_id: ctx.user.id,
        kind: parsed.data.kind,
        item_id: parsed.data.itemId,
        sentence: parsed.data.sentence,
        feedback: null, // TODO IA : correction grammaire/prononciation
      })
      .select("*")
      .single();
    if (error) throw error;
    return ok(data);
  } catch {
    return serverError();
  }
}
