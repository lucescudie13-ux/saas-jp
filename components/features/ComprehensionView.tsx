"use client";

import type { Comprehension } from "@/lib/comprehension-content";
import { AnswerCard } from "./AnswerCard";

/** Compréhension écrite : le texte, puis les questions (saisie + auto-évaluation). */
export function ComprehensionView({ c }: { c: Comprehension }) {
  const paragraphs = c.text.split(/\n\s*\n+/).filter((p) => p.trim());
  return (
    <div className="comp">
      {c.title && <h3 className="comp-title">{c.title}</h3>}
      <div className="comp-text">
        {paragraphs.map((p, i) => (
          <p key={i}>{p.trim()}</p>
        ))}
      </div>
      {c.targetWords.length > 0 && (
        <p className="comp-words"><b>Mots de la leçon :</b> {c.targetWords.join("・")}</p>
      )}
      <div className="lm-subh">Questions de compréhension</div>
      {c.questions.map((q, i) => (
        <AnswerCard key={i} prompt={q} answer={c.answers[i] ?? ""} />
      ))}
    </div>
  );
}
