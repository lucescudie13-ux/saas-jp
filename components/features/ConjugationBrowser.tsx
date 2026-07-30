"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";
import type { GatedGroup } from "@/lib/access";
import { LockedLessonRows } from "./LockedLessonRows";

/**
 * Liste des règles de conjugaison, ordonnée par leçon et dévoilée au fur et à
 * mesure : terminer une leçon ouvre la suivante. Chaque carte ouvre la leçon
 * correspondante ; les leçons non dévoilées apparaissent en bloc verrouillé.
 *
 * Le niveau vient de l'URL (cf. la page) : c'est le serveur qui décide de ce
 * qui est dévoilé, il doit donc connaître le niveau.
 */
export function ConjugationBrowser({
  level,
  groups,
}: {
  level: JlptLevel;
  groups: GatedGroup<{ code: string }>[];
}) {
  const [query, setQuery] = useState("");

  const revealed = groups.filter((g) => g.revealed);
  const locked = groups.filter((g) => !g.revealed);

  const q = query.trim().toLowerCase();
  const searching = q !== "";
  const shown = revealed.filter((g) => !q || g.title.toLowerCase().includes(q));

  const lockedCount = locked.reduce((n, g) => n + g.count, 0);

  if (groups.length === 0) {
    return <p className="empty">Les règles de conjugaison du niveau {level} arriveront bientôt.</p>;
  }

  return (
    <div className="cur">
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
            ? `${shown.length} leçon${shown.length > 1 ? "s" : ""}`
            : `${revealed.length} débloquée${revealed.length > 1 ? "s" : ""} · ${lockedCount} règle${lockedCount > 1 ? "s" : ""} à venir`}
        </span>
      </div>

      {searching && shown.length === 0 ? (
        <p className="empty">Aucune règle débloquée ne correspond à « {query} ».</p>
      ) : (
        <div className="vlesson-groups">
          {shown.map((g) => (
            <Link
              key={g.num}
              href={`/lecon/${level}/${g.num}` as Route}
              className="block"
              style={{ marginBottom: 0, padding: "13px 18px", textDecoration: "none", display: "block" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 className="block-title" style={{ margin: 0 }}>
                  <span className="vlesson-num" style={{ marginRight: 10 }}>Leçon {g.num}</span>
                  {g.title}
                </h3>
                <span className="pill-tag" style={{ margin: 0, flex: "none" }}>
                  {g.count} règle{g.count > 1 ? "s" : ""}
                </span>
              </div>
            </Link>
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
    </div>
  );
}
