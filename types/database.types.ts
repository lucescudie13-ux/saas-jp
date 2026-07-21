// =====================================================================
// Types de base de données.
// ⚠️ Version écrite à la main (suffisante pour compiler & typer les requêtes).
// Régénère la version exacte depuis ton schéma avec :  npm run db:types
// (équivaut à : supabase gen types typescript --linked > types/database.types.ts)
// =====================================================================

export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export type VocabType = "kanji" | "mot" | "verbe" | "adjectif";
export type ItemKind = "vocab" | "phrase" | "grammar" | "dialogue" | "reading";
export type QuestionDirection = "FR_JP" | "JP_FR";
export type ProgressStatus = "new" | "learning" | "review" | "mastered";
export type LessonStatus = "not_started" | "in_progress" | "completed";

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type Timestamps = { created_at: string; updated_at: string };

export type VocabItemRow = Timestamps & {
  id: string;
  slug: string;
  level: JlptLevel;
  type: VocabType;
  lemma: string;
  reading: string | null;
  gloss: string;
  readings: Array<{ k: string; v: string }>;
  sens: { together: string; parts?: Array<{ g: string; r: string; m: string }> } | null;
  decomp: string | null;
  keys: Array<{ g: string; n: string }>;
  mnemo: string | null;
  origin: string | null;
  cn: { has: boolean; glyph: string; pinyin: string; note: string; hsk?: string } | null;
  examples: Array<{ jp: string; yomi: string; fr: string }>;
  confuse: Array<{ g: string; n: string; d: string }>;
  conj: { group: string; rows: Array<[string, string]> } | null;
  usage: string | null;
  position: number;
}

export type PhraseRow = Timestamps & {
  id: string; slug: string; level: JlptLevel;
  lemma: string; reading: string | null; gloss: string; position: number;
}

// Leçon détaillée optionnelle attachée à un point de grammaire (rendue par GrammarDrawer).
export type GrammarContent = {
  formula?: string;                                  // ex. « V-ないでください »
  intro?: string;
  formation?: {
    intro?: string;
    rows: Array<{ group: string; verb: string; form: string; meaning: string }>;
  };
  rules?: Array<{ label: string; text: string }>;
  breakdown?: { steps: Array<{ jp: string; romaji: string; fr: string }> };
  note?: string;                                     // point essentiel
  compare?: Array<{ type: "aff" | "neg"; jp: string; fr: string }>;
  examples?: Array<{ jp: string; fr: string }>;
  softener?: { text: string; example: { jp: string; fr: string } };
  mistakes?: Array<{ ok: boolean; form: string; note: string }>;
  without?: string;                                  // ～ないで sans ください
  summary?: string;                                  // à retenir
  sources?: string[];
};

export type GrammarPointRow = Timestamps & {
  id: string; slug: string; level: JlptLevel;
  lemma: string; gloss: string; detail: string | null;
  content: GrammarContent | null; position: number;
}

export type GrammarQuestionRow = {
  id: string; grammar_id: string; direction: QuestionDirection;
  prompt: string; answer: string; position: number;
}

export type DialogueRow = Timestamps & {
  id: string; slug: string; level: JlptLevel;
  lemma: string; reading: string | null; gloss: string; title: string | null; position: number;
}
export type DialogueLineRow = { id: string; dialogue_id: string; speaker: string; jp: string; fr: string; position: number; }
export type DialogueQuestionRow = { id: string; dialogue_id: string; prompt: string; answer: string; position: number; }

export type ReadingRow = Timestamps & {
  id: string; slug: string; level: JlptLevel;
  title: string; body: string; translation: string | null; position: number;
}
export type ReadingQuestionRow = { id: string; reading_id: string; prompt: string; answer: string; position: number; }

export type LessonRow = Timestamps & {
  id: string; level: JlptLevel; number: number; title: string; summary: string | null; position: number;
}
export type LessonItemRow = { id: string; lesson_id: string; kind: ItemKind; item_id: string; position: number; }

export type ProfileRow = Timestamps & {
  id: string; email: string | null; display_name: string | null; avatar_url: string | null;
  current_level: JlptLevel; target_level: JlptLevel | null; target_deadline: string | null;
}

export type UserPreferencesRow = Timestamps & {
  user_id: string; daily_goal_minutes: number; reminder_time: string | null;
  show_romaji: boolean; theme: string; study_pair: string;
}

export type UserItemProgressRow = Timestamps & {
  id: string; user_id: string; kind: ItemKind; item_id: string; status: ProgressStatus;
  ease_factor: number; interval_days: number; repetitions: number; lapses: number;
  last_rating: string | null; last_reviewed_at: string | null; due_at: string | null;
}

export type LessonProgressRow = Timestamps & {
  id: string; user_id: string; lesson_id: string; status: LessonStatus;
  current_step: number; completed_at: string | null;
}

export type StudySessionRow = {
  id: string; user_id: string; activity: string; duration_seconds: number;
  items_reviewed: number; correct: number; total: number; occurred_at: string; created_at: string;
}

export type SentenceSubmissionRow = {
  id: string; user_id: string; kind: ItemKind; item_id: string;
  sentence: string; feedback: Json | null; created_at: string;
}

export type SubscriptionRow = Timestamps & {
  id: string; user_id: string; status: string; plan: string | null;
  stripe_customer_id: string | null; stripe_subscription_id: string | null;
  current_period_end: string | null;
}

// Aplatit une intersection en un type objet « littéral » homomorphe : indispensable
// pour que chaque table satisfasse `Record<string, unknown>` (sinon le schéma
// supabase-js se résout en `never` et toutes les lignes deviennent `never`).
type Flatten<T> = { [K in keyof T]: T[K] };

type Table<Row> = {
  Row: Flatten<Row>;
  Insert: Partial<Flatten<Row>>;
  Update: Partial<Flatten<Row>>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      vocab_items: Table<VocabItemRow>;
      phrases: Table<PhraseRow>;
      grammar_points: Table<GrammarPointRow>;
      grammar_questions: Table<GrammarQuestionRow>;
      dialogues: Table<DialogueRow>;
      dialogue_lines: Table<DialogueLineRow>;
      dialogue_questions: Table<DialogueQuestionRow>;
      readings: Table<ReadingRow>;
      reading_questions: Table<ReadingQuestionRow>;
      lessons: Table<LessonRow>;
      lesson_items: Table<LessonItemRow>;
      profiles: Table<ProfileRow>;
      user_preferences: Table<UserPreferencesRow>;
      user_item_progress: Table<UserItemProgressRow>;
      lesson_progress: Table<LessonProgressRow>;
      study_sessions: Table<StudySessionRow>;
      sentence_submissions: Table<SentenceSubmissionRow>;
      subscriptions: Table<SubscriptionRow>;
      achievements: Table<{ id: string; slug: string; title: string; emoji: string | null; description: string | null; position: number }>;
      user_achievements: Table<{ id: string; user_id: string; achievement_id: string; unlocked_at: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      jlpt_level: JlptLevel; vocab_type: VocabType; item_type: ItemKind;
      question_direction: QuestionDirection; progress_status: ProgressStatus; lesson_status: LessonStatus;
    };
  };
}
