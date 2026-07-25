import Stripe from "stripe";

// Client Stripe serveur. Tant que STRIPE_SECRET_KEY n'est pas défini, tout
// reste dormant (getStripe() → null) et l'app fonctionne normalement.

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  cached = key ? new Stripe(key) : null;
  return cached;
}

/** Prix d'abonnement « Pro » (Price ID Stripe). */
export const stripePriceId = () => process.env.STRIPE_PRICE_ID ?? "";

/** URL publique de l'app (pour les redirections success/cancel). */
export const appUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
