import { getAuthedContext } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { subscriptionRepository } from "@/server/subscriptions/subscription.repository";
import { ok, unauthorized, serverError } from "@/lib/utils";

/**
 * DELETE → suppression définitive du compte et de toutes ses données (RGPD,
 * droit à l'effacement). Aucune conservation, aucune corbeille.
 *
 * L'ordre des opérations compte :
 *
 *  1. ANNULER L'ABONNEMENT STRIPE D'ABORD. Effacer le compte ne dit rien à
 *     Stripe : la carte continuerait d'être débitée chaque mois pour un compte
 *     qui n'existe plus, et le client n'aurait plus aucun moyen de l'arrêter.
 *     C'est le piège le plus coûteux de cette route.
 *  2. Supprimer l'utilisateur d'auth. Tout le reste part en cascade
 *     (auth.users → profiles → préférences, progression, abonnement, sessions),
 *     vérifié sur les migrations : aucune table ne référence l'utilisateur sans
 *     `on delete cascade`.
 *
 * Le client Stripe lui-même est conservé : il porte l'historique de facturation,
 * que la comptabilité doit garder. Il ne contient ni progression ni contenu
 * personnel au-delà de l'e-mail rattaché aux factures déjà émises.
 */
export async function DELETE() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();
  const userId = ctx.user.id;

  // — 1. Couper la facturation avant tout —
  const stripe = getStripe();
  const sub = await subscriptionRepository.getForUser(ctx.db, userId).catch(() => null);
  if (stripe && sub?.stripe_subscription_id) {
    try {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);
    } catch (err) {
      const e = err as { code?: string; message?: string };
      // Déjà annulé (`resource_missing`) : ce n'est pas une erreur, on continue.
      if (e?.code !== "resource_missing") {
        console.error("[account] annulation Stripe impossible", { code: e?.code, message: e?.message });
        return serverError(
          "Impossible d'annuler ton abonnement pour l'instant. Le compte n'a pas été supprimé, " +
            "pour éviter de continuer à te facturer. Réessaie dans un moment.",
        );
      }
    }
  }

  // — 2. Supprimer le compte : la cascade emporte toutes les données —
  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) throw error;
  } catch (err) {
    console.error("[account] suppression impossible", (err as { message?: string })?.message);
    return serverError("La suppression a échoué. Rien n'a été supprimé, réessaie dans un moment.");
  }

  return ok({ deleted: true });
}
