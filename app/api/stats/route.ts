import { getAuthedContext } from "@/lib/api";
import { statsService } from "@/server/stats/stats.service";
import { ok, unauthorized, serverError } from "@/lib/utils";

export async function GET() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  try {
    return ok(await statsService.getDashboard(ctx.db, ctx.user.id));
  } catch {
    return serverError();
  }
}
