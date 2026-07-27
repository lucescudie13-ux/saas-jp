// lib/vocab-seen.ts — mots dont la fiche détaillée a déjà été consultée.
//
// Sert uniquement de repère visuel dans les listes de vocabulaire : un mot déjà
// ouvert s'affiche en gris, pour savoir d'un coup d'œil ce qu'il reste à voir.
// Volontairement local (localStorage) : ce n'est pas de la progression notée,
// contrairement aux parties validées (lib/lesson-progress).

const KEY = "hibi-vocab-seen";
const EVENT = "hibi-vocab-seen";

export function getSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/** Marque un mot comme consulté. Sans effet s'il l'était déjà. */
export function markSeen(id: string): void {
  if (typeof window === "undefined" || !id) return;
  const set = getSeen();
  if (set.has(id)) return;
  set.add(id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/** Oublie tous les mots consultés (remise à zéro de la progression). */
export function clearSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore */
  }
}

/** S'abonne aux changements (retourne la fonction de désabonnement). */
export function onSeenChange(fn: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}
