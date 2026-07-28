import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Webhook Stripe → synchronise la table `subscriptions` (via service role).
// Endpoint public (Stripe n'a pas de session) — exempté d'auth dans le middleware.

/**
 * Fin de la période en cours (date de renouvellement).
 * Depuis l'API 2025-03-31, ce champ n'est plus sur l'abonnement mais sur ses
 * items ; le SDK 22.x est épinglé bien après. On lit les deux emplacements pour
 * rester correct quelle que soit la version d'API du compte.
 */
function periodEndISO(sub: Stripe.Subscription): string | null {
  const onSub = (sub as unknown as { current_period_end?: number }).current_period_end;
  const onItem = sub.items?.data?.[0]?.current_period_end;
  const ts = onSub ?? onItem;
  return ts ? new Date(ts * 1000).toISOString() : null;
}
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("stripe not configured", { status: 200 });

  const sig = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch {
    return new Response("invalid signature", { status: 400 });
  }

  try {
    const admin = createAdminClient();
    const upsert = (userId: string, fields: Record<string, unknown>) =>
      admin.from("subscriptions").upsert({ user_id: userId, ...fields }, { onConflict: "user_id" });

    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = (s.metadata?.user_id ?? s.client_reference_id) as string | undefined;
      if (userId) {
        const lifetime = s.mode === "payment"; // paiement unique = accès à vie
        await upsert(userId, {
          status: "active",
          plan: lifetime ? "lifetime" : "pro",
          stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
          stripe_subscription_id: typeof s.subscription === "string" ? s.subscription : null,
          // L'accès à vie n'expire pas → on fixe la date à null.
          // Pour un abonnement en revanche, la date de renouvellement appartient
          // aux événements customer.subscription.* : on n'y touche PAS ici. Les
          // deux événements arrivent à la même seconde, dans un ordre non
          // garanti — l'écrire ici effacerait la vraie date une fois sur deux.
          ...(lifetime ? { current_period_end: null } : {}),
        });
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id as string | undefined;
      if (userId) {
        const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
        await upsert(userId, {
          status,
          plan: "pro",
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          stripe_subscription_id: sub.id,
          current_period_end: periodEndISO(sub),
        });
      }
    }
  } catch {
    /* on acquitte quand même pour éviter les retries en boucle */
  }

  return new Response("ok", { status: 200 });
}
