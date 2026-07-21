// lib/conjugation-content.ts — cours de conjugaison par leçon (importé côté serveur).
// Source : docx « Conjugaison japonaise ». Mêmes blocs que la grammaire.
// Les leçons « Construire la forme … » (bases) restent à venir (hors du fichier).

import N5 from "./content/conj-N5.json";
import N4 from "./content/conj-N4.json";
import N3 from "./content/conj-N3.json";
import type { JlptLevel } from "./constants";
import type { GrammarRule } from "./grammar-content";

const MAP: Partial<Record<JlptLevel, Record<string, GrammarRule[]>>> = {
  N5: N5 as unknown as Record<string, GrammarRule[]>,
  N4: N4 as unknown as Record<string, GrammarRule[]>,
  N3: N3 as unknown as Record<string, GrammarRule[]>,
};

/** Points de conjugaison d'une leçon du plan, ex. code "F1-N5-02". */
export function getConjugationRules(level: JlptLevel, code: string): GrammarRule[] {
  return MAP[level]?.[code] ?? [];
}
