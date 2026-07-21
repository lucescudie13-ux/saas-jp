import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { statsService } from "@/server/stats/stats.service";
import { LessonTodayPlan } from "@/components/dashboard/LessonTodayPlan";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { WeekChart } from "@/components/dashboard/WeekChart";

export default async function DashboardPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const level = current?.profile?.current_level ?? "N5";
  const goal = current?.preferences?.daily_goal_minutes ?? 18;

  const stats = await statsService.getDashboard(db, current!.id);

  return (
    <>
      <div className="home-hero" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, alignItems: "stretch" }}>
        <LessonTodayPlan level={level} />
        <WeekChart weekly={stats.weekly} goalMinutes={goal} />
      </div>
      <KpiGrid stats={stats} />
    </>
  );
}
