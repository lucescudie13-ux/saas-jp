"use client";

import type { GrammarPointRow } from "@/types/database.types";
import { VerifyForm } from "@/components/forms/VerifyForm";

// Fiche détaillée d'un point de grammaire — leçon complète rendue depuis `content`
// (réutilise les classes du prototype : .drawer, .block, table.conj, .examples…).
export function GrammarDrawer({ item, onClose }: { item: GrammarPointRow | null; onClose: () => void }) {
  if (!item) return null;
  const c = item.content;

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="drawer-hero">
          <div className="dh-glyph" style={{ fontSize: 40, fontWeight: 800 }}>{item.lemma}</div>
          <div className="dh-meta">
            <span className="jlpt-badge">{item.level}</span>
            {c?.formula && <div className="dh-reading">{c.formula}</div>}
            <div className="dh-gloss">{item.gloss}</div>
          </div>
        </div>

        {c?.intro && <Block title="Présentation"><p>{c.intro}</p></Block>}

        {c?.formation && (
          <Block title="Formation">
            {c.formation.intro && <p>{c.formation.intro}</p>}
            <ul className="examples" style={{ marginTop: 10 }}>
              {c.formation.rows.map((r, i) => (
                <li key={i}>
                  <div className="ex-yomi" style={{ fontWeight: 700, color: "var(--vermilion-deep)" }}>{r.group}</div>
                  <div className="ex-jp"><span style={{ color: "var(--ink-soft)" }}>{r.verb}</span> → {r.form}</div>
                  <div className="ex-fr">{r.meaning}</div>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {c?.rules && c.rules.length > 0 && (
          <Block title="Les règles par groupe">
            <ul className="parts">
              {c.rules.map((r, i) => (
                <li key={i}><b style={{ color: "var(--vermilion-deep)" }}>{r.label}</b> — {r.text}</li>
              ))}
            </ul>
          </Block>
        )}

        {c?.breakdown && (
          <Block title="L'emboîtement de la formule">
            <ol className="grammar-steps">
              {c.breakdown.steps.map((s, i) => (
                <li key={i}>
                  <span className="gs-jp">{s.jp}</span>
                  <span className="gs-romaji">{s.romaji}</span>
                  <span className="gs-fr">{s.fr}</span>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {c?.note && (
          <Block title="Point essentiel">
            <p className="grammar-callout">{c.note}</p>
          </Block>
        )}

        {c?.compare && c.compare.length > 0 && (
          <Block title="Affirmative & négative">
            <ul className="examples">
              {c.compare.map((r, i) => (
                <li key={i} style={{ borderLeftColor: r.type === "neg" ? "var(--vermilion)" : "var(--line)" }}>
                  <div className="ex-yomi" style={{ fontWeight: 700, color: r.type === "neg" ? "var(--vermilion-deep)" : "var(--ink-soft)" }}>
                    {r.type === "neg" ? "Négative" : "Affirmative"}
                  </div>
                  <div className="ex-jp">{r.jp}</div>
                  <div className="ex-fr">{r.fr}</div>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {c?.examples && c.examples.length > 0 && (
          <Block title="En situation">
            <ul className="examples">
              {c.examples.map((ex, i) => (
                <li key={i}>
                  <div className="ex-jp">{ex.jp}</div>
                  <div className="ex-fr">{ex.fr}</div>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {c?.softener && (
          <Block title="Adoucir avec ね">
            <p>{c.softener.text}</p>
            <ul className="examples" style={{ marginTop: 8 }}>
              <li>
                <div className="ex-jp">{c.softener.example.jp}</div>
                <div className="ex-fr">{c.softener.example.fr}</div>
              </li>
            </ul>
          </Block>
        )}

        {c?.mistakes && c.mistakes.length > 0 && (
          <Block title="Erreurs à éviter">
            <ul className="grammar-mistakes">
              {c.mistakes.map((m, i) => (
                <li key={i} className={m.ok ? "ok" : "ko"}>
                  <span className="gm-form">{m.ok ? "○" : "✕"} {m.form}</span>
                  <span className="gm-note">{m.note}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {c?.without && (
          <Block title="～ないで sans ください"><p>{c.without}</p></Block>
        )}

        {c?.summary && (
          <Block title="À retenir">
            <p className="grammar-callout">{c.summary}</p>
          </Block>
        )}

        {c?.sources && c.sources.length > 0 && (
          <Block title="Sources pédagogiques">
            <ul className="parts">
              {c.sources.map((s, i) => (<li key={i}>{s}</li>))}
            </ul>
          </Block>
        )}

        <Block title="Vérifie tes connaissances">
          <VerifyForm kind="grammar" itemId={item.id} />
        </Block>
      </aside>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="block">
      <h3 className="block-title">{title}</h3>
      <div className="block-body">{children}</div>
    </section>
  );
}
