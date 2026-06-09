import { getAuthedContext } from "@/lib/api";
import { progressService } from "@/server/progress/progress.service";
import { reviewInputSchema } from "@/server/progress/progress.validation";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

// Enregistre une révision SRS. Le user vient du serveur (jamais du body).
export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = reviewInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  try {
    const row = await progressService.review(ctx.db, ctx.user.id, parsed.data);
    return ok(row);
  } catch {
    return serverError();
  }
}
