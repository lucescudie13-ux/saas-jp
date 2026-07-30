import * as Sentry from "@sentry/nextjs";

/**
 * Initialisation de Sentry, appelée depuis instrumentation.ts.
 *
 * CÔTÉ SERVEUR UNIQUEMENT, et c'est un choix mesuré : brancher Sentry dans le
 * navigateur ajoutait 216 ko au bundle client. Or les pannes qui font perdre de
 * l'argent sont côté serveur — signature de webhook refusée, paiement qui
 * échoue, écriture en base ratée — et ce sont précisément celles qui passaient
 * inaperçues. Le coût côté serveur, lui, est nul pour le visiteur.
 * Pour capturer aussi les erreurs JavaScript du navigateur, il suffirait de
 * recréer un `instrumentation-client.ts` appelant cette même fonction, en
 * acceptant le poids.
 *
 * DORMANT PAR DÉFAUT : sans `NEXT_PUBLIC_SENTRY_DSN`, `init` n'est pas appelé du
 * tout et Sentry n'envoie rien. Même logique que Stripe dans ce projet — une
 * variable manquante ne doit jamais casser l'application, seulement désactiver
 * la fonctionnalité.
 *
 * tracesSampleRate à 0 : on veut les ERREURS, pas les traces de performance,
 * qui sont ce qui consomme le quota.
 */
export function initSentry(): void {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0,
    // Ne pas remonter le bruit d'extensions de navigateur ni les coupures réseau.
    ignoreErrors: [
      "ResizeObserver loop",
      "NetworkError",
      "Failed to fetch",
      "AbortError",
    ],
  });
}
