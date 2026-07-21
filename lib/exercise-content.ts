// lib/exercise-content.ts — exercices de traduction par leçon (importé côté serveur).
// Source : docx « Exercices de traduction ». Chaque paire {jp, answer} sert
// dans les deux sens (japonais → français et français → japonais).

import gN5 from "./content/gram-ex-N5.json";
import gN4 from "./content/gram-ex-N4.json";
import gN3 from "./content/gram-ex-N3.json";
import gN2 from "./content/gram-ex-N2.json";
import gN1 from "./content/gram-ex-N1.json";
import cN5 from "./content/conj-ex-N5.json";
import cN4 from "./content/conj-ex-N4.json";
import cN3 from "./content/conj-ex-N3.json";
import cN2 from "./content/conj-ex-N2.json";
import cN1 from "./content/conj-ex-N1.json";
import type { JlptLevel } from "./constants";

export interface ExItem {
  jp: string;
  answer: string;
}

const cast = (x: unknown) => x as Record<string, ExItem[]>;
const GRAM: Record<JlptLevel, Record<string, ExItem[]>> = { N5: cast(gN5), N4: cast(gN4), N3: cast(gN3), N2: cast(gN2), N1: cast(gN1) };
const CONJ: Record<JlptLevel, Record<string, ExItem[]>> = { N5: cast(cN5), N4: cast(cN4), N3: cast(cN3), N2: cast(cN2), N1: cast(cN1) };

export function getGrammarExercises(level: JlptLevel, code: string): ExItem[] {
  return GRAM[level]?.[code] ?? [];
}
export function getConjExercises(level: JlptLevel, code: string): ExItem[] {
  return CONJ[level]?.[code] ?? [];
}
