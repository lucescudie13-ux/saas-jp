// lib/comprehension-content.ts — compréhension écrite par leçon (côté serveur).
// Clé = code de la leçon de vocabulaire (ex. "V-N5-01"). Texte + questions/réponses.

import N5 from "./content/comp-N5.json";
import N4 from "./content/comp-N4.json";
import N3 from "./content/comp-N3.json";
import N2 from "./content/comp-N2.json";
import N1 from "./content/comp-N1.json";
import type { JlptLevel } from "./constants";

export interface Comprehension {
  title: string;
  text: string;
  questions: string[];
  answers: string[];
  targetWords: string[];
}

const cast = (x: unknown) => x as Record<string, Comprehension>;
const MAP: Record<JlptLevel, Record<string, Comprehension>> = { N5: cast(N5), N4: cast(N4), N3: cast(N3), N2: cast(N2), N1: cast(N1) };

export function getComprehension(level: JlptLevel, vocabCode: string): Comprehension | null {
  return MAP[level]?.[vocabCode] ?? null;
}
