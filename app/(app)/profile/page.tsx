import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { subscriptionService } from "@/server/subscriptions/subscription.service";
import Link from "next/link";
import type { Route } from "next";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { DragonNameField } from "@/components/forms/DragonNameField";
import { ResetProgressButton } from "@/components/forms/ResetProgressButton";
import { DeleteAccountButton } from "@/components/forms/DeleteAccountButton";
import { ReplayTutorialButton } from "@/components/onboarding/ReplayTutorialButton";
import { BillingPortalButton } from "@/components/features/BillingPortalButton";
import { subscriptionRepository } from "@/server/subscriptions/subscription.repository";

export default async function ProfilePage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  if (!current?.profile) redirect("/login");
  const sub = await subscriptionService.getStatus(db, current.id);
  // Le portail Stripe n'a de sens que si un paiement a déjà été rattaché au
  // compte : sans client Stripe, il n'y a rien à y gérer.
  const hasBilling = Boolean(
    (await subscriptionRepository.getForUser(db, current.id).catch(() => null))?.stripe_customer_id,
  );

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Profil</span>
        <h1>Mon compte</h1>
        <p>Gère tes informations, ton niveau et ton objectif.</p>
      </div>

      <div className="profile-grid">
        <ProfileForm profile={current.profile} />

        <DragonNameField />

        <div className="pcard">
          <h3>Progression</h3>
          <p style={{ color: "var(--ink-soft)" }}>
            Une leçon terminée = 100 XP = un niveau de dragon. Ces 100 XP sont partagés
            entre ses parties (33 / 33 / 34 pour vocabulaire + grammaire + conjugaison),
            et chaque partie se valide en faisant ses exercices jusqu&apos;au bout.
          </p>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <ReplayTutorialButton />
            <ResetProgressButton />
          </div>
        </div>

        <div className="pcard">
          <h3>Compte</h3>
          <p style={{ color: "var(--ink-soft)" }}>Connecté en tant que <strong>{current.email}</strong></p>
          <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
            Abonnement : <strong>{sub.isPro ? "Pro" : "Gratuit"}</strong>
          </p>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {!sub.isPro && (
              <Link href={"/abonnement" as Route} className="btn primary">Passer à Pro →</Link>
            )}
            {hasBilling && <BillingPortalButton className="btn ghost" />}
          </div>
          <form action="/auth/signout" method="post" style={{ marginTop: 16 }}>
            <button className="btn ghost" type="submit">Se déconnecter</button>
          </form>
        </div>

        {/* Zone dangereuse, à part et en dernier : on ne mélange pas une action
            irréversible avec les réglages courants. */}
        <div className="pcard danger-zone">
          <h3>Supprimer mon compte</h3>
          <p style={{ color: "var(--ink-soft)" }}>
            Efface définitivement ton compte et toutes tes données : profil, progression,
            dragon, historique. Ton abonnement est annulé au passage, pour que rien ne
            continue à t&apos;être facturé.
          </p>
          <div style={{ marginTop: 14 }}>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </>
  );
}
