import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
};

// Sentry n'enveloppe la configuration que pour l'instrumentation et l'envoi des
// source maps. Sans NEXT_PUBLIC_SENTRY_DSN, rien n'est initialisé au démarrage
// (cf. lib/sentry-init.ts) : aucune requête réseau, aucun surcoût à l'exécution.
export default withSentryConfig(nextConfig, {
  silent: true,
  // Téléversement des source maps seulement si les identifiants existent, sinon
  // le build casserait pour quelqu'un qui n'a pas de compte Sentry.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
});
