// lib/lesson-progress.ts — état de validation des leçons du plan.
// Stocké localement pour l'instant (localStorage) ; sera relié au compte
// utilisateur (table de progression) quand les leçons passeront en base.

const KEY = "hibi-validated-lessons";

export function getValidated(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function setValidated(code: string, done: boolean): Set<string> {
  const set = getValidated();
  if (done) set.add(code);
  else set.delete(code);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("hibi-progress"));
  } catch {
    /* ignore */
  }
  return set;
}
