"use client";

import { useState } from "react";
import type { VocabItemRow } from "@/types/database.types";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { VocabDrawer } from "./VocabDrawer";
import { Flashcards, type FlashcardItem } from "./Flashcards";

type Mode = "list" | "review";

export function VocabBrowser({ items }: { items: VocabItemRow[] }) {
  const [mode, setMode] = useState<Mode>("list");
  const [selected, setSelected] = useState<VocabItemRow | null>(null);

  const cards: FlashcardItem[] = items.map((v) => ({
    id: v.id,
    front: v.lemma,
    sub: v.reading ?? undefined,
    back: v.gloss + (v.examples[0] ? ` — ${v.examples[0].jp}` : ""),
  }));

  return (
    <div>
      <div className="mode-switch">
        <button className={`mode-btn ${mode === "list" ? "active" : ""}`} onClick={() => setMode("list")}>Liste</button>
        <button className={`mode-btn ${mode === "review" ? "active" : ""}`} onClick={() => setMode("review")}>Mode révision</button>
      </div>

      {mode === "list" ? (
        items.length === 0 ? (
          <p className="empty">Aucun mot pour ce niveau. Ajoute du contenu dans la table <code>vocab_items</code>.</p>
        ) : (
          <ul className="vlist">
            {items.map((v) => (
              <li key={v.id} className="vrow" onClick={() => setSelected(v)}>
                <span className="vglyph">{v.lemma}</span>
                <span className="vmid">
                  {v.reading && <span className="vreading">{v.reading}</span>}
                  <span className="vgloss">{v.gloss}</span>
                </span>
                <span className="vtags">
                  <span className="vtype">{VOCAB_TYPE_LABELS[v.type] ?? v.type}</span>
                  <span className="jlpt-badge">{v.level}</span>
                </span>
              </li>
            ))}
          </ul>
        )
      ) : (
        <Flashcards kind="vocab" items={cards} />
      )}

      <VocabDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
