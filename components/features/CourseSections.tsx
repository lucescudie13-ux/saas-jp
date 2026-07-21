"use client";

import type { VracSection } from "@/lib/vrac";
import { JpText } from "./JpText";
import { TranslationExercise } from "./TranslationExercise";

/**
 * Rendu du corps d'un cours (sections : titres, paragraphes, encadrés,
 * tableaux, chaînes d'emboîtement, exemples, erreurs à éviter, phrase
 * interactive, mini-exercice). Partagé entre les leçons Vrac et le modèle
 * de leçon du plan.
 */
export function CourseSections({ sections }: { sections: VracSection[] }) {
  return (
    <article className="course-body">
      {sections.map((s, i) => (
        <section key={i} className="course-section">
          {s.heading && <h2>{s.heading}</h2>}

          {s.paragraphs?.map((p, j) => (
            <p key={j}>{p}</p>
          ))}

          {s.sentence && (
            <div className="jp-sentence-card">
              <JpText tokens={s.sentence.tokens} size={s.sentence.size} />
            </div>
          )}

          {s.exercise && (
            <div style={{ marginTop: 16 }}>
              <TranslationExercise items={s.exercise.items} targetLabel={s.exercise.targetLabel} />
            </div>
          )}

          {s.callout && (
            <div className="course-callout">
              {s.callout.includes(" — ") ? (
                <>
                  <b>{s.callout.split(" — ")[0]}</b>
                  <span>{s.callout.slice(s.callout.indexOf(" — ") + 3)}</span>
                </>
              ) : (
                <span>{s.callout}</span>
              )}
            </div>
          )}

          {s.table && (
            <div className="course-table-wrap">
              <table className="course-table">
                {s.table.headers && (
                  <thead>
                    <tr>
                      {s.table.headers.map((h, k) => (
                        <th key={k}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {s.table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {s.chain && (
            <ol className="course-chain">
              {s.chain.map((step, k) => (
                <li key={k}>
                  <span className="cc-jp">{step.jp}</span>
                  {step.romaji && <span className="cc-romaji">{step.romaji}</span>}
                  {step.fr && <span className="cc-fr">{step.fr}</span>}
                </li>
              ))}
            </ol>
          )}

          {s.examples && (
            <ul className="course-examples">
              {s.examples.map((ex, k) => (
                <li key={k}>
                  <span className="ce-jp">{ex.jp}</span>
                  <span className="ce-fr">{ex.fr}</span>
                </li>
              ))}
            </ul>
          )}

          {s.mistakes && (
            <ul className="course-mistakes">
              {s.mistakes.map((m, k) => (
                <li key={k} className={m.ok ? "ok" : "ko"}>
                  <span className="cm-form">
                    <span className="cm-mark">{m.ok ? "○" : "✕"}</span> {m.form}
                  </span>
                  <span className="cm-note">{m.note}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
