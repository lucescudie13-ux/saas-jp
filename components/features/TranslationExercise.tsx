"use client";

import { useMemo, useState } from "react";

export interface TranslationItem {
  /** Phrase japonaise à traduire. */
  jp: string;
  /** Lecture en kana (indice optionnel). */
  reading?: string;
  /** Traduction modèle. */
  answer: string;
  /** Remarque pédagogique optionnelle affichée à la correction. */
  note?: string;
}

type Result = "good" | "again";

/** Sens de traduction : japonais → langue cible, ou langue cible → japonais. */
export type ExerciseDirection = "jp-fr" | "fr-jp";

/**
 * Exercice de traduction — gabarit réutilisable, dans les deux sens.
 * `direction = "jp-fr"` (défaut) : on lit le japonais, on traduit en français.
 * `direction = "fr-jp"` : on lit le français, on écrit le japonais (la lecture
 * kana et la phrase japonaise sont dévoilées à la correction).
 * Une phrase à la fois : l'apprenant écrit sa traduction, révèle le modèle,
 * puis s'auto-évalue. Barre de progression + récapitulatif final.
 */
export function TranslationExercise({
  items,
  targetLabel,
  direction = "jp-fr",
  onComplete,
}: {
  items: TranslationItem[];
  targetLabel?: string;
  direction?: ExerciseDirection;
  onComplete?: () => void;
}) {
  const jpToFr = direction === "jp-fr";
  const label = targetLabel ?? (jpToFr ? "français" : "japonais");
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<string[]>(() => items.map(() => ""));
  const [revealed, setRevealed] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [results, setResults] = useState<(Result | null)[]>(() => items.map(() => null));
  const [finished, setFinished] = useState(false);

  const current = items[index];
  const goodCount = useMemo(() => results.filter((r) => r === "good").length, [results]);

  function setDraft(v: string) {
    setDrafts((d) => d.map((x, i) => (i === index ? v : x)));
  }

  function rate(r: Result) {
    const next = results.map((x, i) => (i === index ? r : x));
    setResults(next);
    if (index + 1 >= total) {
      setFinished(true);
      onComplete?.();
    } else {
      setIndex(index + 1);
      setRevealed(false);
      setShowReading(false);
    }
  }

  function restart() {
    setIndex(0);
    setDrafts(items.map(() => ""));
    setRevealed(false);
    setShowReading(false);
    setResults(items.map(() => null));
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((goodCount / total) * 100);
    return (
      <div className="ex-card ex-done">
        <div className="ex-done-emoji">{pct >= 70 ? "🎉" : "💪"}</div>
        <h2>Exercice terminé</h2>
        <p className="ex-done-score">
          <b>{goodCount}</b> / {total} réussies
        </p>
        <div className="ex-progress"><i style={{ width: `${pct}%` }} /></div>
        <ul className="ex-recap">
          {items.map((it, i) => (
            <li key={i} className={results[i] === "good" ? "good" : "again"}>
              <span className="ex-recap-mark">{results[i] === "good" ? "✓" : "✕"}</span>
              <span className="ex-recap-jp">{it.jp}</span>
              <span className="ex-recap-fr">{it.answer}</span>
            </li>
          ))}
        </ul>
        <button className="btn primary" onClick={restart}>Recommencer</button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="ex-wrap">
      <div className="ex-head">
        <span className="ex-count">{index + 1} <span className="ex-count-total">/ {total}</span></span>
        <div className="ex-progress"><i style={{ width: `${(index / total) * 100}%` }} /></div>
      </div>

      <div className="ex-card">
        <div className="ex-prompt-label">Traduis en {label}</div>

        {/* Consigne : japonais (JP → FR) ou français (FR → JP) */}
        {jpToFr ? <p className="ex-jp">{current.jp}</p> : <p className="ex-prompt-fr">{current.answer}</p>}

        {/* Lecture kana : indice au sens JP → FR seulement (elle révélerait la réponse en FR → JP) */}
        {jpToFr && current.reading && (
          showReading ? (
            <p className="ex-reading">{current.reading}</p>
          ) : (
            <button className="ex-hint-btn" onClick={() => setShowReading(true)}>Afficher la lecture</button>
          )
        )}

        <textarea
          className="ex-input"
          rows={2}
          value={drafts[index]}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Ta traduction en ${label}…`}
          disabled={revealed}
        />

        {!revealed ? (
          <div className="ex-actions">
            <button className="btn primary" onClick={() => setRevealed(true)}>Vérifier</button>
          </div>
        ) : (
          <>
            <div className="ex-answer">
              <div className="ex-answer-label">Traduction modèle</div>
              {jpToFr ? (
                <p className="ex-answer-fr">{current.answer}</p>
              ) : (
                <>
                  <p className="ex-jp">{current.jp}</p>
                  {current.reading && <p className="ex-reading">{current.reading}</p>}
                </>
              )}
              {current.note && <p className="ex-answer-note">{current.note}</p>}
            </div>
            <div className="ex-actions ex-rate">
              <button className="btn rate-again" onClick={() => rate("again")}>À revoir</button>
              <button className="btn rate-good" onClick={() => rate("good")}>Je l&apos;avais ✓</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
