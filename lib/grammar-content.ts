// lib/grammar-content.ts — types du contenu de cours (grammaire & conjugaison).
// Le contenu vit désormais en base (grammar_points.detail) ; ce fichier ne
// fournit plus que les types partagés.

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
