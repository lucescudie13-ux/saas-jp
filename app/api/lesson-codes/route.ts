import { z } from "zod";
import { getAuthedContext } from "@/lib/api";
import { ok, unauthorized, badRequest } from "@/lib/utils";

// Progression du plan reliée au compte (codes de module validés).
// Tolérant : si la table n'existe pas encore (migration non appliquée), on
// renvoie une réponse vide/OK — le client retombe sur localStorage sans casser.

export async function GET() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const { data } = await ctx.db.from("user_lesson_codes").select("code").eq("user_id", ctx.user.id);
  return ok((data ?? []).map((r) => r.code));
}

const schema = z.object({ code: z.string().min(1).max(64), done: z.boolean() });

export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  const { code, done } = parsed.data;
  if (done) {
    await ctx.db.from("user_lesson_codes").upsert({ user_id: ctx.user.id, code }, { onConflict: "user_id,code" });
  } else {
    await ctx.db.from("user_lesson_codes").delete().eq("user_id", ctx.user.id).eq("code", code);
  }
  return ok({ code, done });
}

/** Réinitialise toute la progression du compte (remet le dragon à zéro). */
export async function DELETE() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  await ctx.db.from("user_lesson_codes").delete().eq("user_id", ctx.user.id);
  return ok({ reset: true });
}
