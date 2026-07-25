"use client";

// Garde-fou : une erreur de rendu d'une page ne casse pas toute l'app.
export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="route-error">
      <div className="route-error-emoji" aria-hidden>😕</div>
      <h2>Une erreur est survenue</h2>
      <p>Réessaie, ou reviens dans un instant.</p>
      <button type="button" className="btn primary" onClick={reset}>Réessayer</button>
    </div>
  );
}
