"use client";

import { useEffect, useMemo, useState } from "react";
import type { VocabItemRow } from "@/types/database.types";
import type { GatedGroup } from "@/lib/access";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { getSeen, markSeen, onSeenChange } from "@/lib/vocab-seen";
import { VocabDrawer } from "./VocabDrawer";
import { LockedLessonRows } from "./LockedLessonRows";

/**
 * Liste du vocabulaire, ordonnée par leçon — l'ordre porte désormais du sens,
 * puisque le contenu se dévoile leçon après leçon. Chaque mot affiche la leçon
 * dont il vient, et les leçons non dévoilées apparaissent en bloc verrouillé.
 *
 * Le contenu verrouillé n'est PAS envoyé par le serveur : ces blocs n'affichent
 * qu'un numéro, un titre et un décompte.
 */

/** Une ligne de mot. `seen` = fiche déjà consultée → la ligne passe en gris. */
function VocabRow({
  v,
  num,
  lesson,
  seen,
  onClick,
}: {
  v: VocabItemRow;
  num: number;
  lesson: number;
  seen: boolean;
  onClick: () => void;
}) {
  return (
    <li className={`vrow ${seen ? "seen" : ""}`} onClick={onClick} title={seen ? "Fiche déjà consultée" : undefined}>
      <span className="vnum">{num}</span>
      <span className="vglyph">{v.lemma}</span>
      <span className="vreading">{v.reading ?? ""}</span>
      <span className="vgloss">{v.gloss}</span>
      <span className="vtags">
        <span className="vlesson-chip">L{lesson}</span>
        <span className="vtype">{VOCAB_TYPE_LABELS[v.type] ?? v.type}</span>
      </span>
    </li>
  );
}

export function VocabBrowser({ groups }: { groups: GatedGroup<VocabItemRow>[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VocabItemRow | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setSeen(getSeen());
    refresh();
    return onSeenChange(refresh);
  }, []);

  const open = (v: VocabItemRow) => { markSeen(v.id); setSelected(v); };

  const revealed = useMemo(() => groups.filter((g) => g.revealed), [groups]);
  const locked = useMemo(() => groups.filter((g) => !g.revealed), [groups]);

  const revealedCount = useMemo(
    () => revealed.reduce((n, g) => n + g.items.length, 0),
    [revealed],
  );
  const lockedCount = useMemo(() => locked.reduce((n, g) => n + g.count, 0), [locked]);

  // La recherche ne porte que sur le contenu dévoilé — on ne peut pas chercher
  // dans ce qu'on n'a pas encore débloqué.
  const q = query.trim().toLowerCase();
  const matches = (v: VocabItemRow) =>
    !q ||
    v.lemma.toLowerCase().includes(q) ||
    (v.reading ?? "").toLowerCase().includes(q) ||
    v.gloss.toLowerCase().includes(q);

  const searching = q !== "";
  const shown = useMemo(
    () => revealed.map((g) => ({ ...g, items: g.items.filter(matches) })).filter((g) => g.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [revealed, q],
  );
  const shownCount = shown.reduce((n, g) => n + g.items.length, 0);

  if (groups.length === 0) {
    return (
      <p className="empty">
        Aucun mot pour ce niveau. Ajoute du contenu dans <code>vocab_items</code>.
      </p>
    );
  }

  return (
    <div>
      <div className="vocab-toolbar">
        <input
          className="vocab-search"
          type="search"
          placeholder="Rechercher parmi les mots débloqués (kanji, kana ou français)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vocab-count">
          {searching
            ? `${shownCount} mot${shownCount > 1 ? "s" : ""}`
            : `${revealedCount} débloqué${revealedCount > 1 ? "s" : ""} · ${lockedCount} à venir`}
        </span>
      </div>

      {searching && shownCount === 0 ? (
        <p className="empty">Aucun mot débloqué ne correspond à « {query} ».</p>
      ) : (
        <div className="vlesson-groups">
          {shown.map((g) => (
            <section key={g.num} className="vlesson-group">
              <h2 className="vlesson-title">
                <span className="vlesson-num">Leçon {g.num}</span>
                {g.title}
              </h2>
              <ul className="vlist">
                {g.items.map((v, i) => (
                  <VocabRow
                    key={v.id}
                    v={v}
                    num={i + 1}
                    lesson={g.num}
                    seen={seen.has(v.id)}
                    onClick={() => open(v)}
                  />
                ))}
              </ul>
            </section>
          ))}

          {/* Les blocs verrouillés disparaissent pendant une recherche : ils
              n'ont aucun contenu à confronter à la requête. */}
          {!searching &&
            locked.map((g) => (
              <LockedLessonRows
                key={g.num}
                num={g.num}
                title={g.title}
                count={g.count}
                unit="mot"
                reason={g.lockReason ?? "progress"}
              />
            ))}
        </div>
      )}

      <VocabDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
