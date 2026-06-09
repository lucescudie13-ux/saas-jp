import type { Database } from "@/types/database.types";
import { subscriptionRepository } from "./subscription.repository";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

/**
 * STUB abonnements. Aucune logique de paiement pour l'instant.
 * TODO Stripe :
 *   - créer un Customer + Checkout Session côté serveur
 *   - webhook Stripe → mise à jour de `subscriptions` (via service role)
 *   - garder seulement la lecture côté client (RLS)
 */
export const subscriptionService = {
  async getStatus(db: DB, userId: string) {
    const sub = await subscriptionRepository.getForUser(db, userId);
    return { status: sub?.status ?? "inactive", plan: sub?.plan ?? null, isPro: sub?.status === "active" };
  },
  // TODO: createCheckoutSession(userId, plan) { ... }
  // TODO: handleWebhook(event) { ... }
};
