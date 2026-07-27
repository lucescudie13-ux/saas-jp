"use client";

import type { GrammarRule, CourseBlock } from "@/lib/grammar-content";
import { WordText } from "./WordText";

/** Affiche un point de grammaire complet (formule, objectif, cours en blocs).
 * Tout le texte passe par <WordText/> : les mots japonais y sont survolables
 * (lecture, sens, lien vers la fiche), le français est laissé tel quel. */
export function GrammarRuleView({ rule }: { rule: GrammarRule }) {
  return (
    <div className="gr">
      {rule.formula && (
        <div className="course-callout"><b>Formule</b><span><WordText text={rule.formula} /></span></div>
      )}
      {rule.subtitle && <p className="gr-subtitle"><WordText text={rule.subtitle} /></p>}
      {rule.objective && (
        <div className="gr-objective">
          <span className="gr-obj-label">Objectif</span>
          <p><WordText text={rule.objective} /></p>
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
      return <p className="gr-para"><WordText text={b.text ?? ""} /></p>;
    case "bullets":
      return <ul className="gr-bullets">{(b.items ?? []).map((x, j) => <li key={j}><WordText text={x} /></li>)}</ul>;
    case "callout":
      return <div className="course-callout">{b.label && <b>{b.label}</b>}<span><WordText text={b.text ?? ""} /></span></div>;
    case "table":
      return (
        <div className="course-table-wrap">
          <table className="course-table">
            {b.headers && b.headers.length > 0 && (
              <thead><tr>{b.headers.map((h, j) => <th key={j}>{h}</th>)}</tr></thead>
            )}
            <tbody>
              {(b.rows ?? []).map((r, j) => (
                <tr key={j}>{r.map((c, k) => <td key={k}><WordText text={c} /></td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
