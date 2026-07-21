"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons, TRACK_LABELS } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";

export function PlanCurriculum() {
  const [level, setLevel] = useState<JlptLevel>("N5");
  const [validated, setValidatedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setValidatedSet(getValidated());
    refresh();
    window.addEventListener("hibi-progress", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("hibi-progress", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const lessons = getLevelLessons(level);
  const doneCount = lessons.filter((l) => l.codes.length > 0 && l.codes.every((c) => validated.has(c))).length;

  return (
    <div className="cur">
      <div className="lvl-tabs">
        {JLPT_LEVELS.map((lv) => (
          <button key={lv} className={`lvl-tab ${lv === level ? "active" : ""}`} onClick={() => setLevel(lv)}>
            {lv} <span className="lvl-tab-sub">{LEVEL_LABELS[lv]}</span>
          </button>
        ))}
      </div>

      {lessons.length === 0 ? (
        <div className="empty">Les leçons du niveau {level} arriveront bientôt.</div>
      ) : (
        <>
          <div className="cur-head">
            <h2 className="cur-title">{lessons.length} leçons</h2>
            <span className={`cur-track-prog ${doneCount === lessons.length ? "full" : ""}`}>{doneCount} / {lessons.length} validées</span>
          </div>
          <div className="cur-grid">
            {lessons.map((l) => {
              const done = l.codes.length > 0 && l.codes.every((c) => validated.has(c));
              const tip = `Leçon ${l.num} — ${l.modules.map((m) => TRACK_LABELS[m.track]).join(" · ")}`;
              return (
                <Link
                  key={l.num}
                  href={`/lecon/${level}/${l.num}` as Route}
                  className={`cur-cell ${done ? "done" : ""}`}
                  title={tip}
                >
                  {done ? <span className="cur-cell-check" aria-hidden>✓</span> : l.num}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
