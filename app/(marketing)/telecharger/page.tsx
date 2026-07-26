import Link from "next/link";
import type { Metadata } from "next";
import { InstallApp } from "@/components/pwa/InstallApp";

export const metadata: Metadata = {
  title: "Télécharger l'application — Hibi",
  description:
    "Installe Hibi comme une application sur ton ordinateur, ton Android ou ton iPhone. Un accès direct depuis ton écran d'accueil, en plein écran.",
};

export default function Telecharger() {
  return (
    <div className="dl-page">
      <header className="legal-top">
        <Link className="legal-brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <span>日々 Hibi</span>
        </Link>
        <Link className="legal-back" href="/">← Retour à l&apos;accueil</Link>
      </header>

      <main className="dl-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dl-logo" src="/logo.webp" alt="Hibi" />
        <h1>Installe Hibi comme une application</h1>
        <p className="dl-lead">
          Sur ordinateur, Android ou iPhone : ajoute Hibi à ton écran d&apos;accueil et lance-le
          en plein écran, comme une vraie application. Aucun store, aucune installation compliquée.
        </p>

        <InstallApp />

        <div className="dl-cards">
          <div className="dl-card">
            <span className="dl-emoji">💻</span>
            <h3>Ordinateur (PC / Mac)</h3>
            <ol>
              <li>Ouvre le site dans <b>Chrome</b> ou <b>Edge</b>.</li>
              <li>Clique sur l&apos;icône <b>Installer</b> dans la barre d&apos;adresse, ou menu <b>⋮ → Installer Hibi</b>.</li>
              <li>L&apos;app s&apos;ouvre dans sa propre fenêtre.</li>
            </ol>
          </div>
          <div className="dl-card">
            <span className="dl-emoji">🤖</span>
            <h3>Android</h3>
            <ol>
              <li>Ouvre le site dans <b>Chrome</b>.</li>
              <li>Appuie sur <b>Installer l&apos;application</b> (bannière) ou <b>⋮ → Installer l&apos;application</b>.</li>
              <li>L&apos;icône Hibi apparaît sur ton écran d&apos;accueil.</li>
            </ol>
          </div>
          <div className="dl-card">
            <span className="dl-emoji">🍎</span>
            <h3>iPhone / iPad</h3>
            <ol>
              <li>Ouvre le site dans <b>Safari</b>.</li>
              <li>Appuie sur <b>Partager</b> ⬆️, puis <b>« Sur l&apos;écran d&apos;accueil »</b>.</li>
              <li>Valide : l&apos;icône Hibi apparaît sur ton écran d&apos;accueil.</li>
            </ol>
          </div>
        </div>

        <p className="dl-foot">
          Une question ? <Link href="/">Retour à l&apos;accueil</Link> ·{" "}
          <Link href="/login">Se connecter</Link>
        </p>
      </main>
    </div>
  );
}
