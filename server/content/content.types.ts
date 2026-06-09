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

export type ContentKind = ItemKind;
