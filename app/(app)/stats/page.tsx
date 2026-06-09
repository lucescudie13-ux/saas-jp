import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { statsService } from "@/server/stats/stats.service";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { WeekChart } from "@/components/dashboard/WeekChart";

export default async function StatsPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const goal = current?.preferences?.daily_goal_minutes ?? 18;
  const stats = await statsService.getDashboard(db, current!.id);

  const deadline = current?.profile?.target_deadline
    ? new Date(current.profile.target_deadline).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Statistiques</span>
        <h1>Ta progression</h1>
        {current?.profile?.target_level && (
          <p>Objectif : atteindre le <strong>JLPT {current.profile.target_level}</strong>{deadline ? ` · échéance ${deadline}` : ""}.</p>
        )}
      </div>

      <KpiGrid stats={stats} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginTop: 8 }}>
        <WeekChart weekly={stats.weekly} goalMinutes={goal} />
        <div className="kpi-grid" style={{ margin: 0 }}>
          <div className="kpi"><span className="kpi-icon">⏱️</span><div className="kpi-value">{stats.totalMinutes}</div><div className="kpi-label">Minutes (8 sem.)</div></div>
          <div className="kpi"><span className="kpi-icon">🏅</span><div className="kpi-value">{stats.bestStreak} j</div><div className="kpi-label">Meilleure série</div></div>
        </div>
      </div>
    </>
  );
}
