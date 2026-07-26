"use client";

import { useEffect, useMemo, useState } from "react";
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
 * Flashcards à répétition espacée (Ebbinghaus). La carte se retourne (3D) pour
 * révéler la réponse, puis auto-évaluation : À revoir / Difficile / Correct /
 * Facile (touches 1–4). Les notes SRS partent en arrière-plan (fire-and-forget)
 * → le passage d'une carte à l'autre est instantané.
 */
export function Flashcards({ kind, items, onComplete, onDetails }: { kind: ItemKind; items: FlashcardItem[]; onComplete?: () => void; onDetails?: (id: string) => void }) {
  const deck = useMemo(() => items, [items]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [done, setDone] = useState(false);

  function sendReview(itemId: string, rating: SrsRating) {
    fetch("/api/progress/review", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId, rating }),
      keepalive: true,
    }).catch(() => null);
  }

  function next(rating: SrsRating) {
    const card = deck[index];
    if (card) sendReview(card.id, rating);
    if (index + 1 >= deck.length) {
      const duration = Math.round((Date.now() - startedAt) / 1000);
      fetch("/api/study-sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ activity: "flashcards", durationSeconds: duration, itemsReviewed: deck.length }),
        keepalive: true,
      }).catch(() => null);
      setDone(true);
      onComplete?.();
      return;
    }
    setIndex((i) => i + 1);
    setRevealed(false);
  }

  // Revenir à la carte précédente (recto masqué).
  function back() {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setRevealed(false);
  }

  // Clavier : ← revient en arrière ; Espace/Entrée/↑ révèle ; puis 1–4
  // (ou Espace = Correct) pour noter.
  useEffect(() => {
    if (done || deck.length === 0) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); back(); return; }
      if (!revealed) {
        if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp") { e.preventDefault(); setRevealed(true); }
        return;
      }
      if (e.key === "1") { e.preventDefault(); next("again"); }
      else if (e.key === "2") { e.preventDefault(); next("hard"); }
      else if (e.key === "3" || e.key === " " || e.key === "Enter") { e.preventDefault(); next("good"); }
      else if (e.key === "4") { e.preventDefault(); next("easy"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, index, done, deck.length]);

  if (deck.length === 0) {
    return <p className="empty">Aucun élément à réviser pour l&apos;instant.</p>;
  }

  if (done) {
    return (
      <div className="flash-done">
        <div className="fd-emoji">🎉</div>
        <h3>Session terminée</h3>
        <p>{deck.length} carte{deck.length > 1 ? "s" : ""} révisée{deck.length > 1 ? "s" : ""}. Bien joué !</p>
        <button className="btn ghost" onClick={() => { setIndex(0); setRevealed(false); setDone(false); }}>
          Recommencer
        </button>
      </div>
    );
  }

  const card = deck[index]!;
  const pct = Math.round((index / deck.length) * 100);
  return (
    <div className="flash">
      <div className="flash-nav">
        <button type="button" className="flash-prev" onClick={back} disabled={index === 0}>← Précédent</button>
        <span className="flash-count">{index + 1} / {deck.length}</span>
      </div>
      <div className="flash-bar"><i style={{ width: `${pct}%` }} /></div>

      <div className="flashcard-wrap" onClick={() => setRevealed((r) => !r)}>
        <div className={`flashcard3d ${revealed ? "flipped" : ""}`}>
          <div className="fc-face fc-front">
            <div className="fc-glyph">{card.front}</div>
            {card.sub && <div className="fc-sub">{card.sub}</div>}
            <span className="fc-hint">Appuie pour révéler</span>
          </div>
          <div className="fc-face fc-back">
            <div className="fc-back-glyph">{card.front}</div>
            {card.sub && <div className="fc-back-sub">{card.sub}</div>}
            <div className="fc-answer">{card.back}</div>
          </div>
        </div>
      </div>

      {revealed && onDetails && (
        <button type="button" className="flash-details" onClick={() => onDetails(card.id)}>
          📖 Voir la fiche détaillée
        </button>
      )}

      {revealed ? (
        <div className="flash-rate">
          {SRS_RATINGS.map((r, i) => (
            <button key={r} type="button" className={`rate rate-${r}`} onClick={() => next(r)}>
              <span className="rate-label">{RATING_LABEL[r]}</span>
              <span className="rate-key">{i + 1}</span>
            </button>
          ))}
        </div>
      ) : (
        <button type="button" className="flash-reveal" onClick={() => setRevealed(true)}>
          Révéler la réponse
        </button>
      )}
    </div>
  );
}
