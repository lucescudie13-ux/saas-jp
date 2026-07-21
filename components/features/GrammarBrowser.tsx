"use client";

import { useState } from "react";
import type { GrammarPointRow } from "@/types/database.types";
import { GrammarDrawer } from "./GrammarDrawer";

// Liste des points de grammaire. Un point doté d'une leçon détaillée (`content`)
// ouvre une fiche complète (GrammarDrawer) au clic, comme le vocabulaire.
export function GrammarBrowser({ items }: { items: GrammarPointRow[] }) {
  const [selected, setSelected] = useState<GrammarPointRow | null>(null);

  if (items.length === 0) {
    return (
      <p className="empty">
        Aucun point pour ce niveau. Ajoute du contenu dans <code>grammar_points</code>.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((g) => {
        const hasLesson = !!g.content;
        return (
          <div
            key={g.id}
            className="block"
            style={{ marginBottom: 0, cursor: hasLesson ? "pointer" : "default" }}
            onClick={hasLesson ? () => setSelected(g) : undefined}
            role={hasLesson ? "button" : undefined}
            tabIndex={hasLesson ? 0 : undefined}
            onKeyDown={hasLesson ? (e) => { if (e.key === "Enter") setSelected(g); } : undefined}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 className="block-title" style={{ margin: 0 }}>{g.lemma}</h3>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {hasLesson && <span className="pill-tag" style={{ margin: 0 }}>Leçon</span>}
                <span className="jlpt-badge">{g.level}</span>
              </span>
            </div>
            <div className="block-body" style={{ marginTop: 8 }}>
              <p style={{ fontWeight: 600, color: "var(--ink)" }}>{g.gloss}</p>
              {g.detail && <p style={{ color: "var(--ink-soft)", margin: 0 }}>{g.detail}</p>}
              {hasLesson && (
                <p style={{ color: "var(--vermilion-deep)", fontWeight: 700, fontSize: 13, marginTop: 8 }}>
                  Ouvrir la leçon →
                </p>
              )}
            </div>
          </div>
        );
      })}

      <GrammarDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
