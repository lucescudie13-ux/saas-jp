"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";
import type { VocabItemRow } from "@/types/database.types";
import { getLevelLessons } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";
import { Flashcards } from "./Flashcards";

/**
 * Séance du jour. Au clic sur « Continuer », l'utilisateur choisit entre :
 *  — le « Vocabulaire du jour » (révision qui revient chaque jour ; la valider
 *    enregistre une session → la série/streak du jour est validée), ou
 *  — continuer sa leçon en cours.
 */

function todayKey() {
  const d = new Date();
  return `hibi-daily-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

export function DailyHub({ level, daily, streak = 0 }: { level: JlptLevel; daily: VocabItemRow[]; streak?: number }) {
  const [mode, setMode] = useState<"choice" | "vocab" | "done">("choice");
  const [validated, setValidated] = useState<Set<string>>(new Set());
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    setValidated(getValidated());
    try { setDoneToday(localStorage.getItem(todayKey()) === "1"); } catch { /* ignore */ }
  }, []);

  const lessons = getLevelLessons(level);
  const isDone = (l: (typeof lessons)[number]) => l.codes.length > 0 && l.codes.every((c) => validated.has(c));
  const next = lessons.find((l) => !isDone(l)) ?? lessons[lessons.length - 1] ?? null;
  const nextTheme = next ? (next.modules.find((m) => m.track === "vocab")?.lesson.title ?? next.modules[0]?.lesson.title ?? "") : "";
  const lessonHref = (next ? `/lecon/${level}/${next.num}` : "/plan") as Route;

  const cards = daily.map((v) => ({ id: v.id, front: v.lemma, sub: v.reading ?? undefined, back: v.gloss }));

  function onComplete() {
    try { localStorage.setItem(todayKey(), "1"); } catch { /* ignore */ }
    setDoneToday(true);
    setMode("done");
  }

  if (mode === "vocab") {
    return (
      <div className="daily-run">
        <button className="vrac-back" onClick={() => setMode("choice")}>← Retour</button>
        <Flashcards kind="vocab" items={cards} onComplete={onComplete} />
      </div>
    );
  }

  if (mode === "done") {
    return (
      <div className="daily-done">
        <div className="daily-done-emoji">🔥</div>
        <h2>Série validée</h2>
        <div className="daily-done-actions">
          <Link href={lessonHref} className="btn primary">Continuer la leçon →</Link>
          <Link href={"/plan" as Route} className="btn ghost">Retour au plan</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="daily">
      {streak > 0 && (
        <div className="daily-streak"><span aria-hidden>🔥</span> {streak} jour{streak > 1 ? "s" : ""} de suite</div>
      )}

      <div className="daily-choice">
        <button
          type="button"
          className={`daily-card daily-vocab ${doneToday ? "is-done" : ""}`}
          onClick={() => daily.length > 0 && setMode("vocab")}
          disabled={daily.length === 0}
        >
          <span className="daily-card-top">
            <span className="daily-medallion vocab" aria-hidden>🧠</span>
            {doneToday && <span className="done-badge">Validé</span>}
          </span>
          <span className="daily-card-title">Vocabulaire du jour</span>
          <span className="daily-card-sub">{daily.length > 0 ? `${daily.length} mots` : "Bientôt disponible"}</span>
          <span className="daily-card-cta">Réviser →</span>
        </button>

        <Link href={lessonHref} className="daily-card daily-lesson">
          <span className="daily-card-top">
            <span className="daily-medallion lesson" aria-hidden>📘</span>
          </span>
          <span className="daily-card-title">Continuer la leçon</span>
          <span className="daily-card-sub">{next ? `Leçon ${next.num}${nextTheme ? ` · ${nextTheme}` : ""}` : "Plan d'étude"}</span>
          <span className="daily-card-cta">Continuer →</span>
        </Link>
      </div>
    </div>
  );
}
