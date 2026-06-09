"use client";

import { useMemo, useState } from "react";
import { SRS_RATINGS, type SrsRating, type ItemKind } from "@/lib/constants";

export interface FlashcardItem {
  id: string;
  front: string;
  sub?: string;
  back: string;
}

const RATING_LABEL: Record<SrsRating, string> = {
  again: "À revoir",
  hard: "Difficile",
  good: "Correct",
  easy: "Facile",
};

/**
 * Révision par flashcards branchée sur le vrai SRS (SM-2).
 * Chaque note est envoyée à /api/progress/review ; en fin de session,
 * une study_session est enregistrée pour les stats.
 */
export function Flashcards({ kind, items }: { kind: ItemKind; items: FlashcardItem[] }) {
  const deck = useMemo(() => items, [items]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  if (deck.length === 0) {
    return <p className="empty">Aucun élément à réviser pour l&apos;instant.</p>;
  }

  if (done) {
    return (
      <div className="flash-done">
        <div className="fd-emoji">🎉</div>
        <h3>Session terminée</h3>
        <p>{reviewed} carte{reviewed > 1 ? "s" : ""} révisée{reviewed > 1 ? "s" : ""}. Bien joué !</p>
        <button className="btn ghost" onClick={() => { setIndex(0); setRevealed(false); setDone(false); setReviewed(0); }}>
          Recommencer
        </button>
      </div>
    );
  }

  const card = deck[index]!;

  async function rate(rating: SrsRating) {
    await fetch("/api/progress/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId: card.id, rating }),
    }).catch(() => null);

    const nextReviewed = reviewed + 1;
    setReviewed(nextReviewed);

    if (index + 1 >= deck.length) {
      // Fin de session → journalise pour les stats.
      const duration = Math.round((Date.now() - startedAt) / 1000);
      await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ activity: "flashcards", durationSeconds: duration, itemsReviewed: nextReviewed }),
      }).catch(() => null);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  return (
    <div className="flash">
      <div className="flash-progress">{index + 1} / {deck.length}</div>
      <div className={`flashcard ${revealed ? "flip" : ""}`} onClick={() => setRevealed(true)}>
        <div className="fc-front">
          <div className="fc-glyph">{card.front}</div>
          {card.sub && <div className="fc-sub">{card.sub}</div>}
          {!revealed && <div className="fc-hint">Touche pour révéler</div>}
        </div>
        {revealed && <div className="fc-back">{card.back}</div>}
      </div>

      {revealed && (
        <div className="flash-rate">
          {SRS_RATINGS.map((r) => (
            <button key={r} className={`btn rate rate-${r}`} onClick={() => rate(r)}>
              {RATING_LABEL[r]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
