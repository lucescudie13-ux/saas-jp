export const APP_NAME = "日々 Hibi";
export const APP_TAGLINE = "Jour après jour";

export const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;
export type JlptLevel = (typeof JLPT_LEVELS)[number];

export const LEVEL_LABELS: Record<JlptLevel, string> = {
  N5: "Débutant",
  N4: "Élémentaire",
  N3: "Intermédiaire",
  N2: "Avancé",
  N1: "Maîtrise",
};

export const ITEM_TYPES = ["vocab", "phrase", "grammar", "dialogue", "reading"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];
export type ItemKind = ItemType;

export const VOCAB_TYPE_LABELS: Record<string, string> = {
  kanji: "Caractère",
  mot: "Mot",
  verbe: "Verbe",
  adjectif: "Adjectif",
};

// Notation SRS exposée à l'UI (boutons flashcards) → qualité SM-2.
export const SRS_RATINGS = ["again", "hard", "good", "easy"] as const;
export type SrsRating = (typeof SRS_RATINGS)[number];
