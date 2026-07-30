import { getAuthedContext } from "@/lib/api";
import { ok, unauthorized } from "@/lib/utils";

// Tutoriel de bienvenue : mémorisé sur le COMPTE (profiles.onboarded_at) et non
// dans le navigateur, pour qu'un retour depuis un autre appareil ne le rejoue pas.
//
// Tolérant : si la migration 011 n'est pas encore appliquée, on répond OK sans
// rien écrire. Le client garde alors son repère local et l'utilisateur n'est
// pas importuné — un tutoriel n'a jamais à casser une page.

/** POST → le tutoriel a été terminé. */
export async function POST() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const { error } = await ctx.db
    .from("profiles")
    .update({ onboarded_at: new Date().toISOString() })
    .eq("id", ctx.user.id);
  return ok({ onboarded: !error });
}

/** DELETE → rejouer le tutoriel (bouton « Revoir le tutoriel »). */
export async function DELETE() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const { error } = await ctx.db
    .from("profiles")
    .update({ onboarded_at: null })
    .eq("id", ctx.user.id);
  return ok({ reset: !error });
}
