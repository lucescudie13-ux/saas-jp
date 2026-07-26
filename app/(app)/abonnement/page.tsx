import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { subscriptionService } from "@/server/subscriptions/subscription.service";
import { SubscribeButton } from "@/components/features/SubscribeButton";

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ paywall?: string }>;
}) {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const isPro = current
    ? (await subscriptionService.getStatus(db, current.id).catch(() => null))?.isPro ?? false
    : false;
  const fromPaywall = (await searchParams)?.paywall === "1";

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Abonnement</span>
        <h1>Débloque tout Hibi</h1>
      </div>

      {fromPaywall && !isPro && (
        <div className="paywall-note">
          🔒 L&apos;accès à Hibi est réservé aux membres. Choisis une offre ci-dessous pour débloquer
          toutes tes leçons, du N5 au N1.
        </div>
      )}

      {isPro ? (
        <div className="pcard" style={{ maxWidth: 520 }}>
          <h3>Tu es Pro ✓</h3>
          <p style={{ color: "var(--ink-soft)" }}>Tous les niveaux (N5 → N1) sont débloqués. Merci !</p>
        </div>
      ) : (
        <div className="plans">
          <div className="plan">
            <span className="plan-eyebrow">Mensuel</span>
            <div className="plan-price"><b>14,99 €</b><span>/ mois</span></div>
            <ul className="plan-feats">
              <li>Tous les niveaux N5 → N1</li>
              <li>Sans engagement, annulable à tout moment</li>
            </ul>
            <SubscribeButton plan="monthly" label="Choisir le mensuel →" className="btn primary plan-cta" />
          </div>

          <div className="plan featured">
            <span className="plan-badge">Le plus avantageux</span>
            <span className="plan-eyebrow">Accès à vie</span>
            <div className="plan-price"><b>197 €</b><span>une fois</span></div>
            <ul className="plan-feats">
              <li>Tous les niveaux N5 → N1, pour toujours</li>
              <li>Un seul paiement, aucun abonnement</li>
            </ul>
            <SubscribeButton plan="lifetime" label="Accès à vie →" className="btn primary plan-cta" />
          </div>
        </div>
      )}
    </>
  );
}
