// lib/grammar-content.ts — cours de grammaire par leçon (importé côté serveur).
// Source : docx « Grammaire japonaise ». Chaque leçon du plan regroupe plusieurs
// points (règles) ; chaque point est un cours complet (mêmes blocs que le Vrac).
// Contenu volumineux → à n'importer que depuis un composant serveur.

import N5 from "./content/grammar-N5.json";
import N4 from "./content/grammar-N4.json";
import N3 from "./content/grammar-N3.json";
import N2 from "./content/grammar-N2.json";
import type { JlptLevel } from "./constants";

export interface CourseBlock {
  t: "heading" | "para" | "bullets" | "table" | "callout";
  text?: string;
  items?: string[];
  headers?: string[] | null;
  rows?: string[][];
  label?: string | null;
}

export interface GrammarRule {
  title: string;
  formula: string;
  subtitle: string;
  objective: string;
  blocks: CourseBlock[];
}

const MAP: Partial<Record<JlptLevel, Record<string, GrammarRule[]>>> = {
  N5: N5 as unknown as Record<string, GrammarRule[]>,
  N4: N4 as unknown as Record<string, GrammarRule[]>,
  N3: N3 as unknown as Record<string, GrammarRule[]>,
  N2: N2 as unknown as Record<string, GrammarRule[]>,
};

/** Règles (points de grammaire) d'une leçon du plan, ex. code "N5-01". */
export function getGrammarRules(level: JlptLevel, code: string): GrammarRule[] {
  return MAP[level]?.[code] ?? [];
}
