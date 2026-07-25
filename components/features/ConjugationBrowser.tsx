"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons } from "@/lib/curriculum";

/**
 * Liste des règles de conjugaison, par niveau JLPT — même présentation que la
 * grammaire. Les règles proviennent de la piste « conjugaison » du curriculum ;
 * chaque carte ouvre la leçon correspondante.
 */

type Rule = { code: string; title: string; count: number; num: number };

export function ConjugationBrowser() {
  const [level, setLevel] = useState<JlptLevel>("N5");
  const [query, setQuery] = useState("");

  const rules: Rule[] = useMemo(() => {
    const out: Rule[] = [];
    for (const l of getLevelLessons(level)) {
      for (const m of l.modules) {
        if (m.track === "conjugation") {
          out.push({ code: m.lesson.code, title: m.lesson.title, count: m.lesson.count, num: l.num });
        }
      }
    }
    return out;
  }, [level]);

  const q = query.trim().toLowerCase();
  const filtered = q ? rules.filter((r) => r.title.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)) : rules;

  return (
    <div className="cur">
      <div className="tabs-jlpt">
        {JLPT_LEVELS.map((lv) => (
          <button key={lv} className={`jtab ${lv === level ? "active" : ""}`} onClick={() => setLevel(lv)} title={LEVEL_LABELS[lv]}>
            {lv}
          </button>
        ))}
      </div>

      <div className="vocab-toolbar">
        <input
          className="vocab-search"
          type="search"
          placeholder="Rechercher une règle de conjugaison…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="vocab-count">{filtered.length} règle{filtered.length > 1 ? "s" : ""}</span>
      </div>

      {rules.length === 0 ? (
        <p className="empty">Les règles de conjugaison du niveau {level} arriveront bientôt.</p>
      ) : filtered.length === 0 ? (
        <p className="empty">Aucune règle ne correspond à « {query} ».</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((r) => (
            <Link key={r.code} href={`/lecon/${level}/${r.num}` as Route} className="block" style={{ marginBottom: 0, padding: "13px 18px", textDecoration: "none", display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 className="block-title" style={{ margin: 0 }}>{r.title}</h3>
                <span className="pill-tag" style={{ margin: 0, flex: "none" }}>{r.count} règle{r.count > 1 ? "s" : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
