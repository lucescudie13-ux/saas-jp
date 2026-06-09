import { getAuthedContext } from "@/lib/api";
import { contentService } from "@/server/content/content.service";
import { uuidSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError, json } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) return badRequest("id invalide");
  try {
    const item = await contentService.getVocab(ctx.db, id);
    if (!item) return json({ error: "Introuvable" }, { status: 404 });
    return ok(item);
  } catch {
    return serverError();
  }
}
