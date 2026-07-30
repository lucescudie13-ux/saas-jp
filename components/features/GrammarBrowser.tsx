"use client";

import { useMemo, useState } from "react";
import type { GrammarPointRow } from "@/types/database.types";
import type { GatedGroup } from "@/lib/access";
import { parseGrammarCourse } from "@/lib/grammar-content";
import { GrammarDrawer } from "./GrammarDrawer";
import { LockedLessonRows } from "./LockedLessonRows";

/**
 * Liste des points de grammaire, ordonnée par leçon et dévoilée au fur et à
 * mesure : terminer une leçon ouvre la suivante. Chaque point indique la leçon
 * dont il vient, et les leçons non dévoilées apparaissent en bloc verrouillé.
 *
 * Le cours riche vit dans `detail` (JSON) et n'est envoyé par le serveur que
 * pour les leçons dévoilées — on n'affiche jamais le JSON brut, seulement un
 * résumé ; le clic ouvre la fiche complète.
 */
export function GrammarBrowser({ groups }: { groups: GatedGroup<GrammarPointRow>[] }) {
  const [selected, setSelected] = useState<GrammarPointRow | null>(null);
  const [query, setQuery] = useState("");

  // Parse une seule fois : résumé lisible, et on écarte la conjugaison
  // (elle a sa propre page).
  const parsedGroups = useMemo(
    () =>
      groups.map((g) => ({
        ...g,
        points: g.items
          .map((point) => {
            const { track, rules } = parseGrammarCourse(point.detail);
            const first = rules[0];
            const hasLesson = rules.length > 0;
            const summary = hasLesson
              ? first?.subtitle || first?.objective || ""
              : point.detail && !point.detail.trim().startsWith("{") && !point.detail.trim().startsWith("[")
                ? point.detail
                : "";
            return { point, track, hasLesson, summary };
          })
          .filter((p) => p.track !== "conjugation"),
      })),
    [groups],
  );

  const revealed = parsedGroups.filter((g) => g.revealed);
  const locked = parsedGroups.filter((g) => !g.revealed);

  const q = query.trim().toLowerCase();
  const searching = q !== "";
  const shown = revealed
    .map((g) => ({
      ...g,
      points: g.points.filter(
        (p) =>
          !q ||
          p.point.lemma.toLowerCase().includes(q) ||
          p.point.gloss.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.points.length > 0);

  const revealedCount = revealed.reduce((n, g) => n + g.points.length, 0);
  const lockedCount = locked.reduce((n, g) => n + g.count, 0);
  const shownCount = shown.reduce((n, g) => n + g.points.length, 0);

  if (groups.length === 0) {
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
          placeholder="Rechercher parmi les règles débloquées…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vocab-count">
          {searching
            ? `${shownCount} point${shownCount > 1 ? "s" : ""}`
            : `${revealedCount} débloqué${revealedCount > 1 ? "s" : ""} · ${lockedCount} à venir`}
        </span>
      </div>

      {searching && shownCount === 0 ? (
        <p className="empty">Aucune règle débloquée ne correspond à « {query} ».</p>
      ) : (
        <div className="vlesson-groups">
          {shown.map((g) => (
            <section key={g.num} className="vlesson-group">
              <h2 className="vlesson-title">
                <span className="vlesson-num">Leçon {g.num}</span>
                {g.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {g.points.map(({ point, hasLesson, summary }) => (
                  <div
                    key={point.id}
                    className="block"
                    style={{ marginBottom: 0, padding: "13px 18px", cursor: hasLesson ? "pointer" : "default" }}
                    onClick={hasLesson ? () => setSelected(point) : undefined}
                    role={hasLesson ? "button" : undefined}
                    tabIndex={hasLesson ? 0 : undefined}
                    onKeyDown={hasLesson ? (e) => { if (e.key === "Enter") setSelected(point); } : undefined}
                  >
                    <h3 className="block-title" style={{ margin: 0 }}>{point.lemma}</h3>
                    {summary && (
                      <p style={{ color: "var(--ink-soft)", margin: "6px 0 0", fontSize: 14 }}>{summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {!searching &&
            locked.map((g) => (
              <LockedLessonRows
                key={g.num}
                num={g.num}
                title={g.title}
                count={g.count}
                unit="règle"
                reason={g.lockReason ?? "progress"}
              />
            ))}
        </div>
      )}

      <GrammarDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
