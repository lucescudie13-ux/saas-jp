import { getAuthedContext } from "@/lib/api";
import { contentRepository } from "@/server/content/content.repository";
import { uuidSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError, json } from "@/lib/utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) return badRequest("id invalide");
  try {
    const lesson = await contentRepository.getLessonById(ctx.db, id);
    if (!lesson) return json({ error: "Introuvable" }, { status: 404 });
    const items = await contentRepository.getLessonItems(ctx.db, id);
    return ok({ lesson, items });
  } catch {
    return serverError();
  }
}
