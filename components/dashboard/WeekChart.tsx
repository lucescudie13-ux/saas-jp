import type { WeeklyPoint } from "@/server/stats/stats.types";

export function WeekChart({ weekly, goalMinutes }: { weekly: WeeklyPoint[]; goalMinutes: number }) {
  const max = Math.max(goalMinutes, ...weekly.map((w) => w.minutes), 1);
  return (
    <div className="chart">
      <div className="chart-head">
        <span>Cette semaine</span>
        <span className="chart-goal">Objectif : {goalMinutes} min/j</span>
      </div>
      <div className="chart-bars">
        {weekly.map((w, i) => (
          <div className="bar-col" key={i}>
            <div className="bar-track">
              <div
                className={`bar-fill ${w.minutes >= goalMinutes ? "hit" : ""}`}
                style={{ height: `${Math.round((w.minutes / max) * 100)}%` }}
                title={`${w.minutes} min`}
              />
            </div>
            <span className="bar-day">{w.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
