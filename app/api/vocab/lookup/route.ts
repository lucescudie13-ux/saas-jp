import { getAuthedContext } from "@/lib/api";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

/** Cherche un mot du vocabulaire par sa graphie exacte (pour les info-bulles). */
export async function GET(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q) return badRequest("q manquant");
  try {
    const { data, error } = await ctx.db
      .from("vocab_items")
      .select("slug,lemma,reading,gloss,level")
      .eq("lemma", q)
      .order("slug")
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return ok(data); // peut être null si le mot n'est pas au programme
  } catch {
    return serverError();
  }
}
