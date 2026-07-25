import { getAuthedContext } from "@/lib/api";
import { getStripe, stripePriceId, appUrl } from "@/lib/stripe";
import { subscriptionRepository } from "@/server/subscriptions/subscription.repository";
import { ok, unauthorized, serverError } from "@/lib/utils";

// Démarre un abonnement « Pro » via Stripe Checkout et renvoie l'URL de paiement.
// Non configuré (pas de clé/prix) → message clair, aucune casse.
export async function POST() {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();

  const stripe = getStripe();
  const price = stripePriceId();
  if (!stripe || !price) return serverError("Paiements bientôt disponibles.");

  try {
    const sub = await subscriptionRepository.getForUser(ctx.db, ctx.user.id).catch(() => null);
    let customer = sub?.stripe_customer_id ?? undefined;
    if (!customer) {
      const created = await stripe.customers.create({
        email: ctx.user.email ?? undefined,
        metadata: { user_id: ctx.user.id },
      });
      customer = created.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: ctx.user.id,
      metadata: { user_id: ctx.user.id },
      subscription_data: { metadata: { user_id: ctx.user.id } },
      success_url: `${appUrl()}/plan?checkout=success`,
      cancel_url: `${appUrl()}/profile?checkout=cancel`,
    });

    return ok({ url: session.url });
  } catch {
    return serverError("Impossible de démarrer le paiement.");
  }
}
