// lib/comprehension-content.ts — type de la compréhension écrite.
// Le contenu vit désormais en base (readings + reading_questions).

export interface Comprehension {
  title: string;
  text: string;
  questions: string[];
  answers: string[];
  targetWords: string[];
}
