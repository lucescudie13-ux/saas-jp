// Types partagés (front + back). Réexporte les types de domaine.
export type {
  JlptLevel, VocabType, ItemKind, QuestionDirection, ProgressStatus, LessonStatus,
  VocabItemRow, PhraseRow, GrammarPointRow, GrammarQuestionRow,
  DialogueRow, DialogueLineRow, DialogueQuestionRow,
  ReadingRow, ReadingQuestionRow, LessonRow, LessonItemRow,
  ProfileRow, UserPreferencesRow, UserItemProgressRow, LessonProgressRow,
  StudySessionRow, SentenceSubmissionRow, SubscriptionRow,
} from "./database.types";

import type { SrsRating } from "@/lib/constants";
export type { SrsRating };

export interface ApiResponse<T> {
  data?: T;
  error?: unknown;
}
