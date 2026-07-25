/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hibi — Apprends le japonais, de zéro à bilingue",
  description:
    "Aussi addictif qu'un jeu, aussi efficace que des cours particuliers. Un dragon évolue avec toi, du niveau N5 au N1. Apprends vraiment le japonais, un peu chaque jour.",
};

const STAGES = ["egg", "hatchling", "apprentice", "adventurer", "master", "legendary"];

const CHIPS = [
  "語 Vocabulaire", "文 Grammaire", "活 Conjugaison", "🧠 Répétition espacée",
  "🎯 Exercices", "✍️ Expression écrite", "🎤 Expression orale", "🗺️ Carte d'aventure",
  "🐉 Dragon évolutif", "🔥 Séance du jour",
];

const COMPARE: Array<[string, string, string, string, string]> = [
  ["Apprentissage réel (kanji, grammaire)", "✓", "✗", "✓", "✓"],
  ["Structuré par niveau JLPT", "✓", "✗", "≈", "≈"],
  ["Interactif & amusant", "✓", "✓", "✗", "≈"],
  ["À ton rythme, 24 h/24", "✓", "✓", "✓", "✗"],
  ["Motivation au quotidien", "✓", "≈", "✗", "✗"],
  ["Prix abordable", "✓", "✓", "✓", "✗"],
];

const cell = (v: string) => (v === "✓" ? "y" : v === "✗" ? "n" : "m");

export default function Landing() {
  return (
    <div className="lp" id="top">
      <header className="lp-nav">
        <a className="lp-brand" href="#top">
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <span className="lp-brand-txt">日々 Hibi</span>
        </a>
        <nav className="lp-nav-links">
          <a href="#concept">Le concept</a>
          <a href="#methode">La méthode</a>
          <a href="#tarifs">Tarifs</a>
        </nav>
        <div className="lp-nav-cta">
          <Link className="lp-nav-login" href="/login">Se connecter</Link>
          <Link className="btn primary" href="/signup">Commencer</Link>
        </div>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-copy">
          <span className="lp-eyebrow">日本語 · du débutant au bilingue</span>
          <h1>De zéro à bilingue en japonais.<br /><span className="lp-hl">Sans jamais t&apos;ennuyer.</span></h1>
          <p className="lp-lead">
            Aussi addictif qu&apos;un jeu, aussi sérieux que des cours particuliers.
            Un dragon grandit avec toi, leçon après leçon — du niveau N5 au N1.
          </p>
          <div className="lp-cta-row">
            <Link className="btn primary lp-cta-lg" href="/signup">Commencer gratuitement →</Link>
            <a className="btn ghost lp-cta-lg" href="#tarifs">Voir les tarifs</a>
          </div>
          <div className="lp-hero-trust">🔥 10 minutes par jour suffisent · Commence gratuitement</div>
        </div>

        <div className="lp-hero-visual">
          <span className="lp-hero-glow" aria-hidden />
          <div className="lp-showcard">
            <div className="lp-show-dragon"><img src="/dragons/adventurer.svg" alt="Ton dragon" /></div>
            <div className="lp-show-name">Ryū</div>
            <div className="lp-show-sub">Aventurier · Niv. 12</div>
            <div className="lp-show-bar"><i /></div>
            <div className="lp-show-stages">
              {STAGES.map((s) => (
                <img key={s} src={`/dragons/${s}.svg`} alt="" className={s === "adventurer" ? "on" : ""} />
              ))}
            </div>
            <div className="lp-show-caption">De l&apos;œuf au dragon légendaire</div>
          </div>
        </div>
      </section>

      <section className="lp-section" id="concept">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Le concept</span>
          <h2>Les applis amusent. Les cours enseignent.<br />Aucun ne fait les deux — Hibi, si.</h2>
        </div>
        <div className="lp-tri">
          <div className="lp-tri-card">
            <span className="lp-tri-emoji">🎮</span>
            <h3>Les applis</h3>
            <p>Amusantes, mais tu répètes des phrases sans vraiment apprendre le japonais.</p>
          </div>
          <div className="lp-tri-card">
            <span className="lp-tri-emoji">📚</span>
            <h3>Les cours &amp; livres</h3>
            <p>Efficaces, mais ennuyeux. La motivation retombe, et tu finis par abandonner.</p>
          </div>
          <div className="lp-tri-card highlight">
            <span className="lp-tri-emoji">🐉</span>
            <h3>Hibi</h3>
            <p>Le meilleur des deux : tu progresses vraiment, et tu y reviens chaque jour avec plaisir.</p>
          </div>
        </div>
      </section>

      <section className="lp-section alt" id="methode">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">La méthode</span>
          <h2>Une vraie méthode, déguisée en jeu.</h2>
          <p className="lp-sec-sub">Apprendre vite, retenir pour de bon, et ne jamais lâcher.</p>
        </div>
        <div className="lp-feats">
          <div className="lp-feat">
            <span className="lp-feat-ic">🐉</span>
            <h3>Un dragon qui évolue avec toi</h3>
            <p>Chaque leçon validée le fait grandir — de l&apos;œuf au légendaire. La motivation qui te fait revenir chaque jour.</p>
          </div>
          <div className="lp-feat">
            <span className="lp-feat-ic">🗺️</span>
            <h3>Un vrai parcours, du N5 au N1</h3>
            <p>Vocabulaire, grammaire, conjugaison, compréhension : structuré comme de vrais cours, niveau JLPT par niveau.</p>
          </div>
          <div className="lp-feat">
            <span className="lp-feat-ic">🧠</span>
            <h3>La mémoire qui dure</h3>
            <p>Répétition espacée (méthode d&apos;Ebbinghaus) : tu révises au bon moment, tu retiens pour de bon. Zéro bachotage.</p>
          </div>
          <div className="lp-feat">
            <span className="lp-feat-ic">✍️</span>
            <h3>Lis, écris, comprends… et parle</h3>
            <p>Pas seulement des mots : kanji, phrases réelles, expression écrite et orale. Un japonais complet.</p>
          </div>
        </div>
        <figure className="lp-map">
          <img src="/roadmap/adventure-map.webp" alt="La carte d'aventure : une route de leçons du niveau N5, du départ au boss final." />
          <figcaption>Ta route de leçons, comme une aventure — du départ au boss de fin de niveau.</figcaption>
        </figure>
      </section>

      <section className="lp-section">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Pourquoi Hibi</span>
          <h2>Mieux qu&apos;une appli, qu&apos;un livre, qu&apos;un prof.</h2>
        </div>
        <div className="lp-compare">
          <table>
            <thead>
              <tr>
                <th />
                <th className="hi">Hibi</th>
                <th>Applis</th>
                <th>Livres</th>
                <th>Prof</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td className={`hi ${cell(row[1])}`}>{row[1]}</td>
                  <td className={cell(row[2])}>{row[2]}</td>
                  <td className={cell(row[3])}>{row[3]}</td>
                  <td className={cell(row[4])}>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lp-section alt">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Ce que tu vas gagner</span>
          <h2>De zéro à bilingue — vraiment.</h2>
        </div>
        <div className="lp-benefits">
          <div className="lp-benefit"><span>🔥</span><div><h3>Une habitude sans effort</h3><p>10 minutes par jour, un objectif quotidien, une série à ne pas casser.</p></div></div>
          <div className="lp-benefit"><span>🎌</span><div><h3>Des résultats concrets</h3><p>Lire un manga en VO, voyager, passer le JLPT — du N5 jusqu&apos;au N1.</p></div></div>
          <div className="lp-benefit"><span>✨</span><div><h3>Le plaisir de progresser</h3><p>Ton dragon grandit, ta carte s&apos;ouvre. Chaque jour, tu vois le chemin parcouru.</p></div></div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Dans l&apos;app</span>
          <h2>Tout pour apprendre, au même endroit.</h2>
        </div>
        <div className="lp-chips">
          {CHIPS.map((c) => <span key={c} className="lp-chip">{c}</span>)}
        </div>
      </section>

      <section className="lp-section alt" id="tarifs">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Tarifs</span>
          <h2>Un prix simple. Débloque tout.</h2>
          <p className="lp-sec-sub">Commence gratuitement, passe à Pro quand tu veux.</p>
        </div>
        <div className="lp-plans">
          <div className="lp-plan">
            <span className="lp-plan-eyebrow">Mensuel</span>
            <div className="lp-plan-price"><b>14,99 €</b><span>/ mois</span></div>
            <ul>
              <li>Tous les niveaux N5 → N1</li>
              <li>Toutes les fonctionnalités</li>
              <li>Sans engagement, annulable à tout moment</li>
            </ul>
            <Link className="btn primary lp-plan-cta" href="/signup">Commencer →</Link>
          </div>
          <div className="lp-plan featured">
            <span className="lp-plan-badge">Le plus avantageux</span>
            <span className="lp-plan-eyebrow">Accès à vie</span>
            <div className="lp-plan-price"><b>197 €</b><span>une fois</span></div>
            <ul>
              <li>Tout le contenu, pour toujours</li>
              <li>Un seul paiement, aucun abonnement</li>
              <li>Toutes les mises à jour incluses</li>
            </ul>
            <Link className="btn primary lp-plan-cta" href="/signup">Accès à vie →</Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-sec-head">
          <span className="lp-eyebrow">Questions</span>
          <h2>Ce qu&apos;on te demande souvent.</h2>
        </div>
        <div className="lp-faq">
          <div className="lp-faq-item"><h3>Faut-il des bases ?</h3><p>Non. On part de zéro, du tout premier caractère.</p></div>
          <div className="lp-faq-item"><h3>Combien de temps par jour ?</h3><p>10 minutes suffisent pour garder ta série et progresser.</p></div>
          <div className="lp-faq-item"><h3>Puis-je annuler ?</h3><p>Oui, à tout moment pour l&apos;offre mensuelle. L&apos;accès à vie est à toi pour toujours.</p></div>
          <div className="lp-faq-item"><h3>Sur quels appareils ?</h3><p>Depuis ton navigateur, sur ordinateur comme sur mobile.</p></div>
        </div>
      </section>

      <section className="lp-final">
        <h2>Ton aventure commence aujourd&apos;hui.</h2>
        <p>De l&apos;œuf au dragon légendaire. Du débutant au bilingue.</p>
        <Link className="btn primary lp-cta-lg" href="/signup">Commencer gratuitement →</Link>
      </section>

      <footer className="lp-footer">
        <div className="lp-brand"><img className="brand-mark" src="/logo.webp" alt="Hibi" /><span className="lp-brand-txt">日々 Hibi</span></div>
        <div className="lp-foot-links">
          <Link href="/login">Connexion</Link>
          <a href="#tarifs">Tarifs</a>
          <Link href="/conditions">Conditions</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </div>
        <span className="lp-foot-copy">© 2026 Hibi · Apprends le japonais, jour après jour.</span>
      </footer>
    </div>
  );
}
