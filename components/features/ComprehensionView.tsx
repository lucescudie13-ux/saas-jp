"use client";

import { useState } from "react";
import type { Comprehension } from "@/lib/comprehension-content";
import { AnswerCard } from "./AnswerCard";
import { WordText } from "./WordText";

/** Compréhension écrite : le texte, puis les questions (saisie + auto-évaluation). */
export function ComprehensionView({ c, onComplete }: { c: Comprehension; onComplete?: () => void }) {
  const [done, setDone] = useState(false);
  const paragraphs = c.text.split(/\n\s*\n+/).filter((p) => p.trim());
  return (
    <div className="comp">
      {c.title && <h3 className="comp-title">{c.title}</h3>}
      <div className="comp-text">
        {paragraphs.map((p, i) => (
          <p key={i}><WordText text={p.trim()} /></p>
        ))}
      </div>
      {c.targetWords.length > 0 && (
        <p className="comp-words"><b>Mots de la leçon :</b> <WordText text={c.targetWords.join("・")} /></p>
      )}
      <div className="lm-subh">Questions de compréhension</div>
      {c.questions.map((q, i) => (
        <AnswerCard key={i} prompt={q} answer={c.answers[i] ?? ""} />
      ))}
      {/* La session ne rapporte ses 10 XP qu'une fois réellement terminée. */}
      {onComplete && (
        done
          ? <p className="lr-step-done">✓ Session terminée — 10 XP gagnés</p>
          : (
            <button
              className="btn primary sm lr-step-cta"
              onClick={() => { setDone(true); onComplete(); }}
            >
              J&apos;ai terminé cet exercice (+10 XP)
            </button>
          )
      )}
    </div>
  );
}
