"use client";

import type { VocabItemRow } from "@/types/database.types";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { VerifyForm } from "@/components/forms/VerifyForm";

// Fiche détaillée d'un mot (réutilise les classes du prototype : .drawer, .panel, .block…).
export function VocabDrawer({ item, onClose }: { item: VocabItemRow | null; onClose: () => void }) {
  if (!item) return null;
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="drawer-hero">
          <div className="dh-glyph">{item.lemma}</div>
          <div className="dh-meta">
            <span className="badge-type">{VOCAB_TYPE_LABELS[item.type] ?? item.type}</span>
            <span className="jlpt-badge">{item.level}</span>
            {item.reading && <div className="dh-reading">{item.reading}</div>}
            <div className="dh-gloss">{item.gloss}</div>
          </div>
        </div>

        {item.readings.length > 0 && (
          <Block title="Lectures">
            <div className="readings">
              {item.readings.map((r, i) => (
                <span className="reading-chip" key={i}><b>{r.k}</b> {r.v}</span>
              ))}
            </div>
          </Block>
        )}

        {item.sens && (
          <Block title="Sens & composition">
            <p dangerouslySetInnerHTML={{ __html: item.sens.together }} />
            {item.sens.parts && item.sens.parts.length > 0 && (
              <ul className="parts">
                {item.sens.parts.map((p, i) => (
                  <li key={i}><span className="part-g">{p.g}</span><span className="part-r">{p.r}</span><span className="part-m">{p.m}</span></li>
                ))}
              </ul>
            )}
          </Block>
        )}

        {(item.decomp || item.keys.length > 0) && (
          <Block title="Décomposition & clés">
            {item.decomp && <p>{item.decomp}</p>}
            {item.keys.length > 0 && (
              <ul className="keys">
                {item.keys.map((k, i) => (<li key={i}><b>{k.g}</b> — {k.n}</li>))}
              </ul>
            )}
          </Block>
        )}

        {item.mnemo && <Block title="Moyen mnémotechnique"><p>{item.mnemo}</p></Block>}
        {item.origin && <Block title="Origine"><p>{item.origin}</p></Block>}

        {item.cn?.has && (
          <Block title="Lien avec le chinois">
            <p><b style={{ fontSize: 20 }}>{item.cn.glyph}</b> · {item.cn.pinyin}{item.cn.hsk ? ` · ${item.cn.hsk}` : ""}</p>
            <p>{item.cn.note}</p>
          </Block>
        )}

        {item.examples.length > 0 && (
          <Block title="Exemples">
            <ul className="examples">
              {item.examples.map((ex, i) => (
                <li key={i}>
                  <div className="ex-jp">{ex.jp}</div>
                  <div className="ex-yomi">{ex.yomi}</div>
                  <div className="ex-fr">{ex.fr}</div>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {item.confuse.length > 0 && (
          <Block title="À ne pas confondre">
            <ul className="confuse">
              {item.confuse.map((c, i) => (<li key={i}><b>{c.g}</b> ({c.n}) — {c.d}</li>))}
            </ul>
          </Block>
        )}

        {item.conj && (
          <Block title={`Conjugaison — ${item.conj.group}`}>
            <table className="conj"><tbody>
              {item.conj.rows.map((row, i) => (
                <tr key={i}><th>{row[0]}</th><td>{row[1]}</td></tr>
              ))}
            </tbody></table>
          </Block>
        )}

        {item.usage && <Block title="Usage"><p>{item.usage}</p></Block>}

        <Block title="Vérifie tes connaissances">
          <VerifyForm kind="vocab" itemId={item.id} />
        </Block>
      </aside>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="block">
      <h3 className="block-title">{title}</h3>
      <div className="block-body">{children}</div>
    </section>
  );
}
