/** Concatène des classes conditionnelles. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** JSON propre pour les réponses d'API. */
export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
}

export function ok(data: unknown) {
  return json({ data }, { status: 200 });
}

export function badRequest(error: unknown) {
  return json({ error }, { status: 400 });
}

export function unauthorized() {
  return json({ error: "Non authentifié" }, { status: 401 });
}

export function serverError(message = "Erreur serveur") {
  return json({ error: message }, { status: 500 });
}
