import { getAuthedContext } from "@/lib/api";
import { getStripe, appUrl } from "@/lib/stripe";
import { subscriptionRepository } from "@/server/subscriptions/subscription.repository";
import { ok, unauthorized, serverError } from "@/lib/utils";

/**
 * Ouvre le portail de facturation Stripe : l'abonné y résilie, change de carte
 * et télécharge ses factures, sans passer par nous.
 *
 * Ce n'est pas un confort : en droit européen, résilier ne doit pas être plus
 * difficile que souscrire. Sans ce portail, la seule voie était de nous écrire.
 *
 * Prérequis côté Stripe : le portail doit être configuré une fois dans le
 * tableau de bord (Paramètres → Facturation → Portail client). Sans ça, l'API
 * répond une erreur de configuration — remontée telle quelle ci-dessous.
 */
export async function POST() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();

  const stripe = getStripe();
  if (!stripe) return serverError("La facturation n'est pas encore configurée.");

  const sub = await subscriptionRepository.getForUser(ctx.db, ctx.user.id).catch(() => null);
  const customer = sub?.stripe_customer_id;
  if (!customer) {
    return serverError("Aucun paiement n'est rattaché à ce compte.");
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${appUrl()}/abonnement`,
    });
    return ok({ url: session.url });
  } catch (err) {
    const e = err as { code?: string; type?: string; message?: string };
    console.error("[billing-portal] échec Stripe", { code: e?.code, type: e?.type, message: e?.message });
    const detail = e?.code ?? e?.type;
    return serverError(
      detail
        ? `Impossible d'ouvrir le portail de facturation (${detail}).`
        : "Impossible d'ouvrir le portail de facturation.",
    );
  }
}
