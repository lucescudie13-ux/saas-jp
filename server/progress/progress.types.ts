import type { ItemKind, ProgressStatus, UserItemProgressRow } from "@/types/database.types";
import type { SrsRating } from "@/lib/constants";

export type { UserItemProgressRow };

export interface ReviewInput {
  kind: ItemKind;
  itemId: string;
  rating: SrsRating;
}

export interface ProgressSummary {
  kind: ItemKind;
  total: number;
  byStatus: Record<ProgressStatus, number>;
  dueCount: number;
}
