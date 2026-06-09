import type { Database } from "@/types/database.types";
import { statsRepository } from "./stats.repository";
import type { DashboardStats, WeeklyPoint } from "./stats.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";
const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

/** Calcule de VRAIES stats à partir du journal d'activité + progression. */
export const statsService = {
  async getDashboard(db: DB, userId: string): Promise<DashboardStats> {
    const now = new Date();
    const since = new Date(now);
    since.setDate(since.getDate() - 56); // 8 semaines de recul

    const [sessions, progress, dueToday, lessonsCompleted] = await Promise.all([
      statsRepository.sessionsSince(db, userId, since.toISOString()),
      statsRepository.progressByKindStatus(db, userId),
      statsRepository.dueCount(db, userId, now.toISOString()),
      statsRepository.completedLessons(db, userId),
    ]);

    const learned = (kind: string) =>
      progress.filter((p) => p.kind === kind && (p.status === "review" || p.status === "mastered")).length;

    // Précision aux quiz (7 derniers jours).
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = sessions.filter((s) => new Date(s.occurred_at) >= weekAgo);
    const totalQ = recent.reduce((a, s) => a + s.total, 0);
    const correctQ = recent.reduce((a, s) => a + s.correct, 0);
    const quizAccuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

    // Minutes par jour (7 derniers jours), pour le graphe.
    const weekly: WeeklyPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const mins = sessions
        .filter((s) => { const t = new Date(s.occurred_at); return t >= d && t < next; })
        .reduce((a, s) => a + s.duration_seconds, 0) / 60;
      weekly.push({ day: DAYS_FR[d.getDay()]!, minutes: Math.round(mins) });
    }

    const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.duration_seconds, 0) / 60);

    // Séries (jours consécutifs avec activité).
    const activeDays = new Set(
      sessions.map((s) => new Date(s.occurred_at).toISOString().slice(0, 10))
    );
    const { currentStreak, bestStreak } = computeStreaks(activeDays, now);

    return {
      wordsLearned: learned("vocab"),
      phrasesLearned: learned("phrase"),
      lessonsCompleted,
      currentStreak,
      bestStreak,
      quizAccuracy,
      totalMinutes,
      dueToday,
      weekly,
    };
  },
};

function computeStreaks(activeDays: Set<string>, now: Date) {
  const key = (d: Date) => d.toISOString().slice(0, 10);

  let currentStreak = 0;
  const cursor = new Date(now); cursor.setHours(0, 0, 0, 0);
  // Tolère que l'activité d'aujourd'hui n'ait pas encore eu lieu.
  if (!activeDays.has(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (activeDays.has(key(cursor))) {
    currentStreak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  let bestStreak = 0, run = 0;
  const sorted = [...activeDays].sort();
  let prev: Date | null = null;
  for (const day of sorted) {
    const d = new Date(day);
    if (prev) {
      const diff = (d.getTime() - prev.getTime()) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    bestStreak = Math.max(bestStreak, run);
    prev = d;
  }
  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}
