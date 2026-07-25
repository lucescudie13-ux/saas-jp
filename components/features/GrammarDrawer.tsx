"use client";

import type { GrammarPointRow } from "@/types/database.types";
import { parseGrammarCourse } from "@/lib/grammar-content";
import { GrammarRuleView } from "./GrammarRuleView";
import { VerifyForm } from "@/components/forms/VerifyForm";

// Fiche détaillée d'un point de grammaire — leçon complète rendue depuis
// `detail` (JSON `{ track, rules }`) via le même affichage que les leçons.
export function GrammarDrawer({ item, onClose }: { item: GrammarPointRow | null; onClose: () => void }) {
  if (!item) return null;
  const { rules } = parseGrammarCourse(item.detail);

  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="drawer-hero">
          <div className="dh-glyph" style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.2 }}>{item.lemma}</div>
          <div className="dh-meta">
            <span className="jlpt-badge">{item.level}</span>
          </div>
        </div>

        {rules.length === 0 ? (
          <section className="block"><div className="block-body"><p>{item.gloss}</p></div></section>
        ) : (
          rules.map((r, i) => (
            <section className="block" key={i}>
              {rules.length > 1 && <h3 className="block-title">{r.title}</h3>}
              <GrammarRuleView rule={r} />
            </section>
          ))
        )}

        <section className="block">
          <h3 className="block-title">Vérifie tes connaissances</h3>
          <VerifyForm kind="grammar" itemId={item.id} />
        </section>
      </aside>
    </>
  );
}
