import { getAuthedContext } from "@/lib/api";
import { contentService } from "@/server/content/content.service";
import { listQuerySchema } from "@/server/content/content.validation";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

export async function GET(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const url = new URL(req.url);
  const parsed = listQuerySchema.safeParse({ level: url.searchParams.get("level") ?? undefined });
  if (!parsed.success) return badRequest(parsed.error.flatten());
  try {
    const data = await contentService.listLessons(ctx.db, parsed.data.level);
    return ok(data);
  } catch {
    return serverError();
  }
}
