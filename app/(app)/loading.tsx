// Squelette affiché instantanément pendant que la page charge ses données
// (Suspense de navigation) → l'app répond tout de suite au clic.
export default function Loading() {
  return (
    <div className="route-loading" aria-busy="true" aria-label="Chargement">
      <div className="rl-head">
        <span className="rl-pill" />
        <span className="rl-title" />
      </div>
      <div className="rl-body">
        <span className="rl-bar" />
        <span className="rl-bar" />
        <span className="rl-bar short" />
      </div>
    </div>
  );
}
