import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { contentService } from "@/server/content/content.service";
import { statsService } from "@/server/stats/stats.service";
import { LessonToday } from "@/components/dashboard/LessonToday";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { WeekChart } from "@/components/dashboard/WeekChart";

export default async function DashboardPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const level = current?.profile?.current_level ?? "N5";
  const goal = current?.preferences?.daily_goal_minutes ?? 18;

  const [composition, stats] = await Promise.all([
    contentService.getLessonComposition(db, level, 1),
    statsService.getDashboard(db, current!.id),
  ]);

  return (
    <>
      <div className="home-hero" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, alignItems: "stretch" }}>
        <LessonToday composition={composition} />
        <WeekChart weekly={stats.weekly} goalMinutes={goal} />
      </div>
      <KpiGrid stats={stats} />
    </>
  );
}
