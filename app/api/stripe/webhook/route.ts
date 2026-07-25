import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Webhook Stripe → synchronise la table `subscriptions` (via service role).
// Endpoint public (Stripe n'a pas de session) — exempté d'auth dans le middleware.
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
          // L'accès à vie n'expire pas ; l'abonnement sera tenu à jour par les
          // événements customer.subscription.*.
          current_period_end: null,
        });
      }
    } else if (event.type.startsWith("customer.subscription.")) {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id as string | undefined;
      if (userId) {
        const status = event.type === "customer.subscription.deleted" ? "canceled" : sub.status;
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
        await upsert(userId, {
          status,
          plan: "pro",
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null,
          stripe_subscription_id: sub.id,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        });
      }
    }
  } catch {
    /* on acquitte quand même pour éviter les retries en boucle */
  }

  return new Response("ok", { status: 200 });
}
