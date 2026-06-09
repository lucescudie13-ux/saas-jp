import { getAuthedContext } from "@/lib/api";
import { progressService } from "@/server/progress/progress.service";
import { itemKindSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

export async function GET(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const kindRaw = new URL(req.url).searchParams.get("kind");
  if (kindRaw) {
    const parsed = itemKindSchema.safeParse(kindRaw);
    if (!parsed.success) return badRequest("kind invalide");
    try {
      return ok(await progressService.listByKind(ctx.db, ctx.user.id, parsed.data));
    } catch { return serverError(); }
  }
  try {
    return ok(await progressService.dueToday(ctx.db, ctx.user.id));
  } catch { return serverError(); }
}
