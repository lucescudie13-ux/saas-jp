import type {
  VocabItemRow, PhraseRow, GrammarPointRow, GrammarQuestionRow,
  DialogueRow, DialogueLineRow, DialogueQuestionRow,
  ReadingRow, ReadingQuestionRow, LessonRow, ItemKind, JlptLevel,
} from "@/types/database.types";

export type { VocabItemRow, PhraseRow, GrammarPointRow, DialogueRow, ReadingRow, LessonRow };

export interface GrammarPointFull extends GrammarPointRow {
  questions: GrammarQuestionRow[];
}

export interface DialogueFull extends DialogueRow {
  lines: DialogueLineRow[];
  questions: DialogueQuestionRow[];
}

export interface ReadingFull extends ReadingRow {
  questions: ReadingQuestionRow[];
}

export interface LessonComposition {
  lesson: LessonRow;
  vocab: VocabItemRow[];
  phrases: PhraseRow[];
  grammar: GrammarPointFull[];
  dialogues: DialogueFull[];
  readings: ReadingFull[];
}

export interface ListQuery {
  level?: JlptLevel;
}

/** Vocabulaire regroupé par leçon (pour l'affichage « trier par leçon »). */
export interface VocabLessonGroup {
  lesson: LessonRow;
  vocab: VocabItemRow[];
}
export interface VocabByLesson {
  /** Groupes de vocabulaire rattachés à une leçon, dans l'ordre des leçons. */
  groups: VocabLessonGroup[];
  /** Mots du niveau non rattachés à une leçon. */
  ungrouped: VocabItemRow[];
}

export type ContentKind = ItemKind;
