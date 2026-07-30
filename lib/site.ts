/**
 * Adresse publique du site, pour robots.txt et sitemap.xml.
 *
 * Séparé de lib/stripe.ts (qui a son propre `appUrl` pour les redirections de
 * paiement) parce qu'une erreur ici n'a pas les mêmes conséquences : une mauvaise
 * URL dans le sitemap fait indexer des adresses inexistantes.
 */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://saas-jp.vercel.app";
  // Sans slash final : les chemins sont concaténés derrière.
  return raw.trim().replace(/\/+$/, "");
}
