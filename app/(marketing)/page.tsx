import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Landing() {
  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "80px 24px" }}>
      <div className="brand" style={{ marginBottom: 28 }}>
        <div className="seal" style={{ background: "linear-gradient(160deg,var(--vermilion),var(--vermilion-deep))" }}>日</div>
        <div className="brand-text"><b>日々 Hibi</b><span>Jour après jour</span></div>
      </div>
      <h1 style={{ fontSize: "clamp(34px,5vw,56px)", lineHeight: 1.05, fontWeight: 800, letterSpacing: "-.5px" }}>
        Apprends le japonais, un peu chaque jour.
      </h1>
      <p style={{ color: "var(--ink-soft)", fontSize: 18, marginTop: 16, maxWidth: "52ch" }}>
        Un parcours structuré par niveau JLPT — vocabulaire, grammaire, dialogues et compréhension — avec une révision espacée intelligente.
      </p>
      <div className="cta-row" style={{ marginTop: 28 }}>
        <Link className="btn primary" href="/signup">Créer mon compte →</Link>
        <Link className="btn ghost" href="/login">Se connecter</Link>
      </div>
    </main>
  );
}
