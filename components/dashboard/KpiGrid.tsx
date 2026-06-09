import type { DashboardStats } from "@/server/stats/stats.types";

export function KpiGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Mots appris", value: stats.wordsLearned, icon: "語" },
    { label: "Phrases", value: stats.phrasesLearned, icon: "💬" },
    { label: "Leçons finies", value: stats.lessonsCompleted, icon: "✓" },
    { label: "Série actuelle", value: `${stats.currentStreak} j`, icon: "🔥" },
    { label: "Précision quiz", value: `${stats.quizAccuracy}%`, icon: "🎯" },
    { label: "À réviser", value: stats.dueToday, icon: "🔁" },
  ];
  return (
    <div className="kpi-grid">
      {cards.map((c) => (
        <div className="kpi" key={c.label}>
          <span className="kpi-icon">{c.icon}</span>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-label">{c.label}</div>
        </div>
      ))}
    </div>
  );
}
