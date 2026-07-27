"use client";

import { useState } from "react";
import { WordText } from "./WordText";

/**
 * Question de compréhension : l'apprenant écrit sa réponse, la vérifie
 * contre le modèle, puis s'auto-évalue (correct / à revoir).
 */
export function AnswerCard({ prompt, answer }: { prompt: string; answer: string }) {
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [verdict, setVerdict] = useState<"good" | "again" | null>(null);

  return (
    <div className="qcard">
      <div className="qprompt"><WordText text={prompt} /></div>
      <textarea
        className="ex-input"
        rows={2}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Écris ta réponse…"
        disabled={revealed}
      />

      {!revealed ? (
        <div className="ac-actions">
          <button className="btn primary sm" onClick={() => setRevealed(true)}>Vérifier</button>
        </div>
      ) : (
        <>
          <div className="qanswer"><WordText text={answer} /></div>
          {verdict ? (
            <div className={`ac-verdict ${verdict}`}>{verdict === "good" ? "✓ Correct" : "✕ À revoir"}</div>
          ) : (
            <div className="ac-rate">
              <button className="btn rate-again sm" onClick={() => setVerdict("again")}>À revoir</button>
              <button className="btn rate-good sm" onClick={() => setVerdict("good")}>Je l&apos;avais ✓</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
