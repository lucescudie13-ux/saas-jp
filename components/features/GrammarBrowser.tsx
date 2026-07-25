"use client";

import { useMemo, useState } from "react";
import type { GrammarPointRow } from "@/types/database.types";
import { parseGrammarCourse } from "@/lib/grammar-content";
import { GrammarDrawer } from "./GrammarDrawer";

// Liste des points de grammaire, avec recherche (comme le vocabulaire). Le
// contenu riche vit dans `detail` (JSON) : on n'affiche jamais le JSON brut,
// seulement un résumé propre ; le clic ouvre la fiche complète.
export function GrammarBrowser({ items }: { items: GrammarPointRow[] }) {
  const [selected, setSelected] = useState<GrammarPointRow | null>(null);
  const [query, setQuery] = useState("");

  // Parse une seule fois : résumé lisible + on écarte les règles de conjugaison
  // (elles ont leur propre page).
  const parsed = useMemo(() => {
    return items
      .map((g) => {
        const { track, rules } = parseGrammarCourse(g.detail);
        const first = rules[0];
        const hasLesson = rules.length > 0;
        const summary = hasLesson
          ? first?.subtitle || first?.objective || ""
          : g.detail && !g.detail.trim().startsWith("{") && !g.detail.trim().startsWith("[")
            ? g.detail
            : "";
        return { g, track, hasLesson, summary };
      })
      .filter((p) => p.track !== "conjugation");
  }, [items]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? parsed.filter(
            (p) =>
              p.g.lemma.toLowerCase().includes(q) ||
              p.g.gloss.toLowerCase().includes(q) ||
              p.summary.toLowerCase().includes(q)
          )
        : parsed,
    [parsed, q]
  );

  if (items.length === 0) {
    return (
      <p className="empty">
        Aucun point pour ce niveau. Ajoute du contenu dans <code>grammar_points</code>.
      </p>
    );
  }

  return (
    <div>
      <div className="vocab-toolbar">
        <input
          className="vocab-search"
          type="search"
          placeholder="Rechercher un point de grammaire…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vocab-count">{filtered.length} point{filtered.length > 1 ? "s" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Aucun point ne correspond à « {query} ».</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(({ g, hasLesson, summary }) => (
            <div
              key={g.id}
              className="block"
              style={{ marginBottom: 0, padding: "13px 18px", cursor: hasLesson ? "pointer" : "default" }}
              onClick={hasLesson ? () => setSelected(g) : undefined}
              role={hasLesson ? "button" : undefined}
              tabIndex={hasLesson ? 0 : undefined}
              onKeyDown={hasLesson ? (e) => { if (e.key === "Enter") setSelected(g); } : undefined}
            >
              <h3 className="block-title" style={{ margin: 0 }}>{g.lemma}</h3>
              {summary && <p style={{ color: "var(--ink-soft)", margin: "6px 0 0", fontSize: 14 }}>{summary}</p>}
            </div>
          ))}
        </div>
      )}

      <GrammarDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
