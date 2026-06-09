import type { Database } from "@/types/database.types";
import { progressRepository } from "./progress.repository";
import { computeSrs, INITIAL_SRS, type SrsState } from "./srs";
import type { ReviewInput } from "./progress.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

/**
 * Logique métier de la progression.
 * Enregistre une révision : calcule le nouvel état SM-2 et le persiste.
 */
export const progressService = {
  async review(db: DB, userId: string, input: ReviewInput) {
    const existing = await progressRepository.getOne(db, userId, input.kind, input.itemId);

    const prev: SrsState = existing
      ? {
          ease_factor: Number(existing.ease_factor),
          interval_days: existing.interval_days,
          repetitions: existing.repetitions,
          lapses: existing.lapses,
        }
      : INITIAL_SRS;

    const next = computeSrs(prev, input.rating);

    return progressRepository.upsert(db, {
      user_id: userId,
      kind: input.kind,
      item_id: input.itemId,
      status: next.status,
      ease_factor: next.ease_factor,
      interval_days: next.interval_days,
      repetitions: next.repetitions,
      lapses: next.lapses,
      last_rating: next.last_rating,
      last_reviewed_at: next.last_reviewed_at,
      due_at: next.due_at,
    });
  },

  async dueToday(db: DB, userId: string) {
    return progressRepository.listDue(db, userId, new Date().toISOString());
  },

  async listByKind(db: DB, userId: string, kind: ReviewInput["kind"]) {
    return progressRepository.listByKind(db, userId, kind);
  },
};
