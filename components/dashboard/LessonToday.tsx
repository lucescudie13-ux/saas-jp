import Link from "next/link";
import type { Route } from "next";
import type { LessonComposition } from "@/server/content/content.types";

const STEPS: { key: keyof Pick<LessonComposition, "vocab" | "phrases" | "grammar" | "dialogues" | "readings">; label: string; icon: string }[] = [
  { key: "vocab", label: "Vocabulaire", icon: "語" },
  { key: "phrases", label: "Phrases", icon: "💬" },
  { key: "grammar", label: "Grammaire", icon: "文" },
  { key: "dialogues", label: "Dialogue", icon: "🎭" },
  { key: "readings", label: "Lecture", icon: "📖" },
];

export function LessonToday({ composition }: { composition: LessonComposition | null }) {
  if (!composition) {
    return (
      <div className="intro">
        <span className="pill-tag">Leçon du jour</span>
        <h2>Pas encore de leçon</h2>
        <p>Ajoute une leçon dans la table <code>lessons</code> (et sa composition dans <code>lesson_items</code>) pour la voir apparaître ici.</p>
      </div>
    );
  }
  const { lesson } = composition;
  const href = `/lesson/${lesson.level}/${lesson.number}` as Route;

  return (
    <div className="intro">
      <span className="pill-tag">Leçon du jour · {lesson.level}-{lesson.number}</span>
      <h2>{lesson.title}</h2>
      {lesson.summary && <p>{lesson.summary}</p>}
      <div className="lesson-steps">
        {STEPS.map((s) => {
          const count = composition[s.key].length;
          return (
            <div className={`lstep ${count ? "" : "muted"}`} key={s.key}>
              <span className="lstep-icon">{s.icon}</span>
              <span className="lstep-label">{s.label}</span>
              <span className="lstep-count">{count}</span>
            </div>
          );
        })}
      </div>
      <div className="cta-row" style={{ marginTop: 20 }}>
        <Link className="btn primary" href={href}>Commencer la leçon →</Link>
        <Link className="btn ghost" href={"/vocab" as Route}>Réviser le vocabulaire</Link>
      </div>
    </div>
  );
}
