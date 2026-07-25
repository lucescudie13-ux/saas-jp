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

/** Contenu de cours tel que stocké dans `grammar_points.detail` (JSON). */
export interface GrammarCourse {
  track?: string; // "grammar" | "conjugation"
  rules: GrammarRule[];
}

/**
 * Parse le champ `detail` d'un point de grammaire. Le contenu riche est un JSON
 * `{ track, rules: [...] }`. Si `detail` n'est pas du JSON (ancienne description
 * texte) ou est vide, renvoie une liste de règles vide.
 */
export function parseGrammarCourse(detail: string | null): GrammarCourse {
  if (!detail) return { rules: [] };
  const trimmed = detail.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return { rules: [] };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as GrammarCourse).rules)) {
      const c = parsed as GrammarCourse;
      return { track: c.track, rules: c.rules };
    }
  } catch {
    /* pas du JSON exploitable */
  }
  return { rules: [] };
}
