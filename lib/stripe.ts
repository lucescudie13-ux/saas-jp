import Stripe from "stripe";

// Client Stripe serveur. Tant que STRIPE_SECRET_KEY n'est pas défini, tout
// reste dormant (getStripe() → null) et l'app fonctionne normalement.

/**
 * Lit une variable d'environnement en la nettoyant.
 * Les champs de saisie des hébergeurs (Vercel notamment, où « Value » est une
 * zone de texte multiligne) laissent facilement passer un espace ou un retour
 * à la ligne invisible au collage. `price_…\n` n'est pas un identifiant valide :
 * Stripe répond `resource_missing`, une erreur qui désigne le tarif alors que
 * le vrai coupable est un caractère blanc. On coupe court.
 */
function envTrimmed(name: string): string {
  return (process.env[name] ?? "").trim();
}

let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = envTrimmed("STRIPE_SECRET_KEY");
  cached = key ? new Stripe(key) : null;
  return cached;
}

/** Prix de l'abonnement mensuel (Price ID Stripe, récurrent). */
export const stripePriceId = () => envTrimmed("STRIPE_PRICE_ID");

/** Prix de l'accès à vie (Price ID Stripe, paiement unique). */
export const stripeLifetimePriceId = () => envTrimmed("STRIPE_LIFETIME_PRICE_ID");

/** URL publique de l'app (pour les redirections success/cancel). */
export const appUrl = () =>
  envTrimmed("NEXT_PUBLIC_APP_URL") ||
  envTrimmed("NEXT_PUBLIC_SITE_URL") ||
  "http://localhost:3000";
