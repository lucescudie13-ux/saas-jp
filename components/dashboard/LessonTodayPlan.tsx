"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";
import { getLevelLessons, TRACK_LABELS, TRACK_ICONS } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";

/**
 * Carte « Leçon du jour » de l'accueil, branchée sur le vrai plan (curriculum).
 * Montre la prochaine leçon non terminée du niveau, ses modules et l'avancement.
 */
export function LessonTodayPlan({ level }: { level: JlptLevel }) {
  const [validated, setValidated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setValidated(getValidated());
    refresh();
    window.addEventListener("hibi-progress", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("hibi-progress", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const lessons = getLevelLessons(level);
  if (lessons.length === 0) {
    return (
      <div className="intro">
        <span className="pill-tag">Leçon du jour</span>
        <h2>Les leçons du niveau {level} arrivent bientôt</h2>
        <p>Choisis un autre niveau depuis le plan d&apos;étude en attendant.</p>
        <div className="cta-row" style={{ marginTop: 20 }}>
          <Link className="btn primary" href={"/plan" as Route}>Voir le plan d&apos;étude →</Link>
        </div>
      </div>
    );
  }

  const isDone = (l: (typeof lessons)[number]) =>
    l.codes.length > 0 && l.codes.every((c) => validated.has(c));
  const doneCount = lessons.filter(isDone).length;
  const allDone = doneCount === lessons.length;
  // Prochaine leçon à faire : la première non terminée (sinon on repart de la 1re).
  const next = lessons.find((l) => !isDone(l)) ?? lessons[0]!;
  const started = doneCount > 0;

  return (
    <div className="intro">
      <span className="pill-tag">
        Leçon du jour · {level}-{next.num}
      </span>
      <h2>Leçon {next.num}</h2>
      <p>
        {allDone
          ? `Bravo, tu as validé les ${lessons.length} leçons du niveau ${level} ! Refais-en une pour réviser.`
          : `${next.modules.map((m) => TRACK_LABELS[m.track]).join(" · ")} — ${doneCount} / ${lessons.length} leçons validées.`}
      </p>
      <div className="lesson-steps">
        {next.modules.map((m) => (
          <div className="lstep" key={m.track}>
            <span className="lstep-icon">{TRACK_ICONS[m.track]}</span>
            <span className="lstep-label">{TRACK_LABELS[m.track]}</span>
            <span className="lstep-count">{m.lesson.count}</span>
          </div>
        ))}
      </div>
      <div className="cta-row" style={{ marginTop: 20 }}>
        <Link className="btn primary" href={`/lecon/${level}/${next.num}` as Route}>
          {started && !allDone ? "Continuer la leçon →" : "Commencer la leçon →"}
        </Link>
        <Link className="btn ghost" href={"/plan" as Route}>
          Voir le plan
        </Link>
      </div>
    </div>
  );
}
