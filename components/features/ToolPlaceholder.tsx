// Écran d'outil IA — placeholder. Conservé pour le design ; aucune intégration LLM (hors MVP).
export function ToolPlaceholder({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <div className="placeholder-tool">
      <div className="emoji">{emoji}</div>
      <h1>{title}</h1>
      <p>{desc}</p>
      <span className="soon">Bientôt disponible</span>
    </div>
  );
}
