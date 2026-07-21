"use client";

import type { GrammarRule, CourseBlock } from "@/lib/grammar-content";

/** Affiche un point de grammaire complet (formule, objectif, cours en blocs). */
export function GrammarRuleView({ rule }: { rule: GrammarRule }) {
  return (
    <div className="gr">
      {rule.formula && (
        <div className="course-callout"><b>Formule</b><span>{rule.formula}</span></div>
      )}
      {rule.subtitle && <p className="gr-subtitle">{rule.subtitle}</p>}
      {rule.objective && (
        <div className="gr-objective">
          <span className="gr-obj-label">Objectif</span>
          <p>{rule.objective}</p>
        </div>
      )}
      {rule.blocks.map((b, i) => <Block key={i} b={b} />)}
    </div>
  );
}

function Block({ b }: { b: CourseBlock }) {
  switch (b.t) {
    case "heading":
      return <h3 className="gr-heading">{b.text}</h3>;
    case "para":
      return <p className="gr-para">{b.text}</p>;
    case "bullets":
      return <ul className="gr-bullets">{(b.items ?? []).map((x, j) => <li key={j}>{x}</li>)}</ul>;
    case "callout":
      return <div className="course-callout">{b.label && <b>{b.label}</b>}<span>{b.text}</span></div>;
    case "table":
      return (
        <div className="course-table-wrap">
          <table className="course-table">
            {b.headers && b.headers.length > 0 && (
              <thead><tr>{b.headers.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
            )}
            <tbody>
              {(b.rows ?? []).map((r, j) => (
                <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
