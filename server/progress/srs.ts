// =====================================================================
// SRS — Algorithme SM-2 (SuperMemo 2), pur et testable.
// Entrée : état courant + note utilisateur. Sortie : nouvel état.
// Mapping note UI → qualité SM-2 (q) :
//   again = 2 (échec), hard = 3, good = 4, easy = 5
// Règle SM-2 : si q < 3 → on réapprend (répétitions = 0, intervalle = 1).
// =====================================================================
import type { SrsRating } from "@/lib/constants";
import type { ProgressStatus } from "@/types/database.types";

export interface SrsState {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
}

export interface SrsResult extends SrsState {
  status: ProgressStatus;
  due_at: string; // ISO
  last_reviewed_at: string; // ISO
  last_rating: SrsRating;
}

const QUALITY: Record<SrsRating, number> = { again: 2, hard: 3, good: 4, easy: 5 };
const MIN_EASE = 1.3;
const MASTERED_INTERVAL = 21; // jours

export function computeSrs(
  prev: SrsState,
  rating: SrsRating,
  now: Date = new Date()
): SrsResult {
  const q = QUALITY[rating];

  // Facteur de facilité (toujours mis à jour, borné à 1.3).
  let ease = prev.ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  ease = Math.max(MIN_EASE, Number(ease.toFixed(2)));

  let repetitions = prev.repetitions;
  let interval = prev.interval_days;
  let lapses = prev.lapses;
  let status: ProgressStatus;

  if (q < 3) {
    // Échec : on réapprend.
    repetitions = 0;
    interval = 1;
    lapses += 1;
    status = "learning";
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(prev.interval_days * ease);
    interval = Math.max(1, interval);
    status = interval >= MASTERED_INTERVAL ? "mastered" : "review";
  }

  const due = new Date(now);
  due.setDate(due.getDate() + interval);

  return {
    ease_factor: ease,
    interval_days: interval,
    repetitions,
    lapses,
    status,
    due_at: due.toISOString(),
    last_reviewed_at: now.toISOString(),
    last_rating: rating,
  };
}

export const INITIAL_SRS: SrsState = {
  ease_factor: 2.5,
  interval_days: 0,
  repetitions: 0,
  lapses: 0,
};
