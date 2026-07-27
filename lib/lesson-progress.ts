// lib/lesson-progress.ts — état de validation des leçons du plan.
//
// localStorage = cache instantané (lectures synchrones dans l'UI). En parallèle,
// on synchronise avec le compte via /api/lesson-codes : write-through à chaque
// validation + fusion depuis le serveur au démarrage (voir <ProgressSync/>).
// Tout est tolérant aux pannes réseau / migration non appliquée → on retombe
// silencieusement sur localStorage.

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

function persistLocal(set: Set<string>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("hibi-progress"));
  } catch {
    /* ignore */
  }
}

export function setValidated(code: string, done: boolean): Set<string> {
  const set = getValidated();
  if (done) set.add(code);
  else set.delete(code);
  persistLocal(set);
  // Write-through vers le compte (fire-and-forget, sans bloquer l'UI).
  try {
    fetch("/api/lesson-codes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, done }),
      keepalive: true,
    }).catch(() => null);
  } catch {
    /* ignore */
  }
  return set;
}

/**
 * Remet la progression à zéro : cache local ET compte. Le dragon repart au
 * niveau 1 / 0 XP et toutes les leçons redeviennent « à faire ».
 */
export async function resetValidated(): Promise<void> {
  if (typeof window === "undefined") return;
  persistLocal(new Set());
  try {
    await fetch("/api/lesson-codes", { method: "DELETE" });
  } catch {
    /* hors ligne : le cache local est déjà vidé */
  }
  // Re-notifie après la réponse serveur (l'UI se rafraîchit dans tous les cas).
  try {
    window.dispatchEvent(new Event("hibi-progress"));
  } catch {
    /* ignore */
  }
}

/** Fusionne les codes validés côté serveur dans le cache local (au démarrage). */
export async function syncValidatedFromServer(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const res = await fetch("/api/lesson-codes");
    if (!res.ok) return;
    const body = (await res.json().catch(() => null)) as { data?: unknown } | null;
    const codes = Array.isArray(body?.data) ? (body!.data as string[]) : [];
    if (codes.length === 0) return;
    const local = getValidated();
    let changed = false;
    for (const c of codes) if (!local.has(c)) { local.add(c); changed = true; }
    if (changed) persistLocal(local);
  } catch {
    /* ignore — localStorage reste la source */
  }
}
