// Panneau de marque (gauche) — statique.
export function BrandAside() {
  return (
    <aside className="aside">
      <div className="watermark" aria-hidden="true">学</div>
      <div className="vrail" aria-hidden="true">日々の学び</div>

      <div className="aside-top">
        <a className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <div><b>日々 Hibi</b><span>Jour après jour</span></div>
        </a>
      </div>

      <div className="aside-mid">
        <div className="eyebrow">Apprends le japonais</div>
        <h2>Un peu de japonais, chaque jour.</h2>
        <p>Un parcours structuré par niveau JLPT — vocabulaire, grammaire, dialogues et compréhension — avec des fiches détaillées et une révision intelligente.</p>
        <ul className="feat">
          <li><span className="fi">🗺️</span>Un plan clair du N5 au N1</li>
          <li><span className="fi">🧠</span>Fiches de mots décortiquées</li>
          <li><span className="fi">🔁</span>Révision espacée (SRS) pour mémoriser</li>
          <li><span className="fi">✨</span>Outils IA — bientôt</li>
        </ul>
      </div>

      <div className="aside-bot">
        <span>© 2026 日々 Hibi</span>
        <a href="/conditions">Conditions</a>
        <a href="/confidentialite">Confidentialité</a>
        <a href="/mentions-legales">Mentions légales</a>
      </div>
    </aside>
  );
}
