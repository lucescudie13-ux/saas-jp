import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { subscriptionService } from "@/server/subscriptions/subscription.service";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { DragonNameField } from "@/components/forms/DragonNameField";
import { SubscribeButton } from "@/components/features/SubscribeButton";

export default async function ProfilePage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  if (!current?.profile) redirect("/login");
  const sub = await subscriptionService.getStatus(db, current.id);

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
          <h3>Compte</h3>
          <p style={{ color: "var(--ink-soft)" }}>Connecté en tant que <strong>{current.email}</strong></p>
          <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>
            Abonnement : <strong>{sub.isPro ? "Pro" : "Gratuit"}</strong>
          </p>
          {!sub.isPro && (
            <div style={{ marginTop: 14 }}>
              <SubscribeButton label="Passer à Pro — débloque tous les niveaux →" className="btn primary" />
            </div>
          )}
          <form action="/auth/signout" method="post" style={{ marginTop: 16 }}>
            <button className="btn ghost" type="submit">Se déconnecter</button>
          </form>
        </div>
      </div>
    </>
  );
}
