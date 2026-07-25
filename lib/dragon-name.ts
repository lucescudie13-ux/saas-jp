// lib/dragon-name.ts — nom personnalisé du dragon.
// Stocké localement pour l'instant (comme la progression des leçons) ; sera
// relié au profil du compte quand ces données passeront en base.

const KEY = "hibi-dragon-name";
export const DEFAULT_DRAGON_NAME = "Ryū";
export const DRAGON_NAME_MAX = 20;

export function getDragonName(): string {
  if (typeof window === "undefined") return DEFAULT_DRAGON_NAME;
  try {
    return window.localStorage.getItem(KEY)?.trim() || DEFAULT_DRAGON_NAME;
  } catch {
    return DEFAULT_DRAGON_NAME;
  }
}

export function setDragonName(name: string): string {
  const clean = name.trim().slice(0, DRAGON_NAME_MAX);
  try {
    if (clean) window.localStorage.setItem(KEY, clean);
    else window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("hibi-dragon-name"));
  } catch {
    /* ignore */
  }
  return clean || DEFAULT_DRAGON_NAME;
}
