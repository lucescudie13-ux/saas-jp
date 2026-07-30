// Layout des pages connectées. La barre latérale (dragon + plan + navigation)
// est rendue ici via <Sidebar />.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { statsService } from "@/server/stats/stats.service";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ProgressSync } from "@/components/features/ProgressSync";
import { Onboarding } from "@/components/onboarding/Onboarding";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  if (!current) redirect("/login");

  const stats = await statsService.getDashboard(db, current.id).catch(() => null);
  const name = current.profile?.display_name ?? current.email?.split("@")[0] ?? "toi";

  return (
    <div className="app">
      <ProgressSync />
      {/* Le serveur a déjà le profil : il sait si le tutoriel doit s'afficher,
          sans qu'aucune requête supplémentaire soit nécessaire côté client. */}
      <Onboarding show={!current.profile?.onboarded_at} />
      <Sidebar level={current.profile?.current_level ?? "N5"} />
      <div className="content">
        <Topbar
          name={name}
          streak={stats?.currentStreak ?? 0}
          dueToday={stats?.dueToday ?? 0}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
