import type Stripe from "stripe";
import { getAuthedContext } from "@/lib/api";
import { getStripe, stripePriceId, stripeLifetimePriceId, appUrl } from "@/lib/stripe";
import { subscriptionRepository } from "@/server/subscriptions/subscription.repository";
import { ok, unauthorized, serverError } from "@/lib/utils";

// Démarre un paiement Stripe Checkout et renvoie l'URL.
// Deux offres : "monthly" (abonnement récurrent) ou "lifetime" (paiement unique).
// Non configuré (clé/prix manquant) → message clair, aucune casse.
export async function POST(req: Request) {
  const ctx = await getAuthedContext();
  if (!ctx) return unauthorized();

  const stripe = getStripe();
  if (!stripe) return serverError("Paiements bientôt disponibles.");

  const body = (await req.json().catch(() => ({}))) as { plan?: string } | null;
  const plan = body?.plan === "lifetime" ? "lifetime" : "monthly";
  const price = plan === "lifetime" ? stripeLifetimePriceId() : stripePriceId();
  if (!price) return serverError("Cette offre n'est pas encore disponible.");
  const mode: Stripe.Checkout.SessionCreateParams.Mode = plan === "lifetime" ? "payment" : "subscription";

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
      mode,
      customer,
      line_items: [{ price, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: ctx.user.id,
      metadata: { user_id: ctx.user.id, plan },
      ...(mode === "subscription"
        ? { subscription_data: { metadata: { user_id: ctx.user.id } } }
        : { payment_intent_data: { metadata: { user_id: ctx.user.id } } }),
      success_url: `${appUrl()}/plan?checkout=success`,
      cancel_url: `${appUrl()}/abonnement?checkout=cancel`,
    });

    return ok({ url: session.url });
  } catch {
    return serverError("Impossible de démarrer le paiement.");
  }
}
