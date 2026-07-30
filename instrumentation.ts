// Point d'entrée serveur — Next appelle `register()` au démarrage.
// Sentry reste dormant tant que NEXT_PUBLIC_SENTRY_DSN n'est pas défini.
import { initSentry } from "@/lib/sentry-init";

export function register() {
  initSentry();
}

// Remonte les erreurs des Server Components et des routes d'API.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
