import { z } from "zod";
import { getAuthedContext } from "@/lib/api";
import { userService } from "@/server/users/user.service";
import { jlptLevelSchema } from "@/lib/validations";
import { ok, unauthorized, badRequest, serverError } from "@/lib/utils";

export async function GET() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  try {
    const current = await userService.getCurrentUser(ctx.db);
    return ok(current);
  } catch {
    return serverError();
  }
}

const patchSchema = z.object({
  display_name: z.string().min(1).max(80).optional(),
  avatar_url: z.string().url().optional(),
  current_level: jlptLevelSchema.optional(),
  target_level: jlptLevelSchema.optional(),
  target_deadline: z.string().date().nullable().optional(),
});

export async function PATCH(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return badRequest(parsed.error.flatten());
  try {
    const profile = await userService.updateProfile(ctx.db, ctx.user.id, parsed.data);
    return ok(profile);
  } catch {
    return serverError();
  }
}
