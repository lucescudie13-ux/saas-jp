"use client";

import { useMemo, useState } from "react";
import type { VocabItemRow } from "@/types/database.types";
import type { VocabByLesson } from "@/server/content/content.types";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { VocabDrawer } from "./VocabDrawer";

type Sort = "list" | "lesson";

/** Une ligne de mot (réutilisée dans la vue liste et la vue par leçon). */
function VocabRow({ v, onClick }: { v: VocabItemRow; onClick: () => void }) {
  return (
    <li className="vrow" onClick={onClick}>
      <span className="vglyph">{v.lemma}</span>
      <span className="vreading">{v.reading ?? ""}</span>
      <span className="vgloss">{v.gloss}</span>
      <span className="vtags">
        <span className="vtype">{VOCAB_TYPE_LABELS[v.type] ?? v.type}</span>
      </span>
    </li>
  );
}

export function VocabBrowser({ items, byLesson }: { items: VocabItemRow[]; byLesson: VocabByLesson }) {
  const [sort, setSort] = useState<Sort>("list");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VocabItemRow | null>(null);

  const hasLessons = byLesson.groups.length > 0;

  // Filtre de recherche : lemma (kanji), lecture (kana) ou traduction.
  const match = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (v: VocabItemRow) =>
      !q ||
      v.lemma.toLowerCase().includes(q) ||
      (v.reading ?? "").toLowerCase().includes(q) ||
      v.gloss.toLowerCase().includes(q);
  }, [query]);

  const listItems = useMemo(() => items.filter(match), [items, match]);
  const groups = useMemo(
    () => byLesson.groups.map((g) => ({ ...g, vocab: g.vocab.filter(match) })).filter((g) => g.vocab.length > 0),
    [byLesson.groups, match]
  );
  const ungrouped = useMemo(() => byLesson.ungrouped.filter(match), [byLesson.ungrouped, match]);

  const visibleCount = sort === "list" ? listItems.length : groups.reduce((n, g) => n + g.vocab.length, 0) + ungrouped.length;
  const noResults = query.trim() !== "" && visibleCount === 0;

  return (
    <div>
      <div className="mode-switch">
        <button className={`mode-btn ${sort === "list" ? "active" : ""}`} onClick={() => setSort("list")}>
          Par liste
        </button>
        <button
          className={`mode-btn ${sort === "lesson" ? "active" : ""}`}
          onClick={() => setSort("lesson")}
          disabled={!hasLessons}
          title={hasLessons ? undefined : "Aucune leçon pour ce niveau"}
        >
          Par leçon
        </button>
      </div>

      <div className="vocab-toolbar">
        <input
          className="vocab-search"
          type="search"
          placeholder="Rechercher (kanji, kana ou français)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vocab-count">{visibleCount} mot{visibleCount > 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 ? (
        <p className="empty">Aucun mot pour ce niveau. Ajoute du contenu dans la table <code>vocab_items</code>.</p>
      ) : noResults ? (
        <p className="empty">Aucun mot ne correspond à « {query} ».</p>
      ) : sort === "list" ? (
        <ul className="vlist">
          {listItems.map((v) => (
            <VocabRow key={v.id} v={v} onClick={() => setSelected(v)} />
          ))}
        </ul>
      ) : (
        <div className="vlesson-groups">
          {groups.map(({ lesson, vocab }) => (
            <section key={lesson.id} className="vlesson-group">
              <h2 className="vlesson-title">
                <span className="vlesson-num">Leçon {lesson.number}</span>
                {lesson.title}
              </h2>
              <ul className="vlist">
                {vocab.map((v) => (
                  <VocabRow key={v.id} v={v} onClick={() => setSelected(v)} />
                ))}
              </ul>
            </section>
          ))}

          {ungrouped.length > 0 && (
            <section className="vlesson-group">
              <h2 className="vlesson-title">
                <span className="vlesson-num">Hors leçon</span>
                Autres mots
              </h2>
              <ul className="vlist">
                {ungrouped.map((v) => (
                  <VocabRow key={v.id} v={v} onClick={() => setSelected(v)} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <VocabDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
