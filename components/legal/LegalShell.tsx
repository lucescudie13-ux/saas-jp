import Link from "next/link";

/**
 * Gabarit commun aux pages légales (mentions légales, CGU/CGV, confidentialité).
 * En-tête avec le logo + retour à l'accueil, colonne de lecture, pied avec les
 * trois liens légaux. Public (hors authentification).
 */
export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="legal-page">
      <header className="legal-top">
        <Link className="legal-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <span>日々 Hibi</span>
        </Link>
        <Link className="legal-back" href="/">← Retour à l&apos;accueil</Link>
      </header>

      <main className="legal">
        <h1>{title}</h1>
        <p className="legal-updated">Dernière mise à jour : {updated}</p>
        {children}
      </main>

      <footer className="legal-foot">
        <Link href="/mentions-legales">Mentions légales</Link>
        <Link href="/conditions">Conditions d&apos;utilisation</Link>
        <Link href="/confidentialite">Politique de confidentialité</Link>
        <span className="legal-foot-copy">© 2026 Hibi</span>
      </footer>
    </div>
  );
}
