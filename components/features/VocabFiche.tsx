"use client";

import type { ReactNode } from "react";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { WordText } from "./WordText";

/**
 * Données d'une fiche de vocabulaire (sous-ensemble de VocabItemRow suffisant
 * pour l'affichage). VocabItemRow est structurellement compatible : la fiche
 * sert donc aussi bien au tiroir du vocabulaire qu'à un aperçu statique (Vrac).
 */
export interface VocabFicheData {
  lemma: string;
  type: string;
  level?: string;
  reading?: string | null;
  gloss: string;
  /** Caractéristiques propres au type de mot (nature, groupe verbal, formation,
   * écriture kana, mot emprunté…) — aident à savoir comment l'apprendre. */
  traits?: Array<{ k: string; v: string }>;
  readings?: Array<{ k: string; v: string }>;
  sens?: { together: string; parts?: Array<{ g: string; r: string; m: string }> } | null;
  decomp?: string | null;
  keys?: Array<{ g: string; n: string }>;
  mnemo?: string | null;
  origin?: string | null;
  cn?: { has: boolean; glyph: string; pinyin: string; note: string; hsk?: string } | null;
  examples?: Array<{ jp: string; yomi: string; fr: string }>;
  confuse?: Array<{ g: string; n: string; d: string }>;
  /** Titre du bloc « confuse » — s'adapte au type (ex. « Verbes proches »,
   * « Mots de la même famille »). Défaut : « À ne pas confondre ». */
  confuseTitle?: string;
  /** Mots & expressions formés à partir du caractère (composés courants). */
  patterns?: { title?: string; label?: string; rows: Array<[string, string]> };
  conj?: { group: string; rows: Array<[string, string]> } | null;
  usage?: string | null;
}

/**
 * Corps de la fiche détaillée d'un mot / caractère. Les blocs affichés
 * dépendent des données présentes (une fiche s'adapte à son type). Pour un
 * caractère (kanji), les sections sont numérotées, comme dans la maquette.
 */
export function VocabFiche({ item }: { item: VocabFicheData }) {
  const traits = item.traits ?? [];
  const readings = item.readings ?? [];
  const keys = item.keys ?? [];
  const examples = item.examples ?? [];
  const confuse = item.confuse ?? [];
  const numbered = item.type === "kanji";

  const blocks: Array<{ title: string; body: ReactNode }> = [];

  if (traits.length > 0) {
    blocks.push({
      title: "Caractéristiques",
      body: (
        <ul className="fiche-traits">
          {traits.map((t, i) => (
            <li key={i}><span className="ft-k">{t.k}</span><span className="ft-v">{t.v}</span></li>
          ))}
        </ul>
      ),
    });
  }

  if (readings.length > 0) {
    blocks.push({
      title: "Lectures",
      body: (
        <div className="readings">
          {readings.map((r, i) => (
            <span className="reading-chip" key={i}><b>{r.k}</b> {r.v}</span>
          ))}
        </div>
      ),
    });
  }

  if (item.sens) {
    blocks.push({
      title: "Sens & composition",
      body: (
        <>
          <p dangerouslySetInnerHTML={{ __html: item.sens.together }} />
          {item.sens.parts && item.sens.parts.length > 0 && (
            <>
              <div className="parts-label">Chaque élément séparément</div>
              <ul className="parts">
                {item.sens.parts.map((p, i) => (
                  <li key={i}>
                    <span className="part-g">{p.g}</span>
                    <span className="part-info">
                      <span className="part-r">{p.r}</span>
                      <span className="part-m">{p.m}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ),
    });
  }

  if (item.conj) {
    blocks.push({
      title: `Conjugaison — ${item.conj.group}`,
      body: (
        <table className="conj"><tbody>
          {item.conj.rows.map((row, i) => (
            <tr key={i}><th>{row[0]}</th><td>{row[1]}</td></tr>
          ))}
        </tbody></table>
      ),
    });
  }

  if (item.usage) {
    blocks.push({ title: "Contexte & usage", body: <p><WordText text={item.usage} /></p> });
  }

  if (item.decomp || keys.length > 0) {
    blocks.push({
      title: "Décomposition & clés",
      body: (
        <>
          {item.decomp && <p>{item.decomp}</p>}
          {keys.length > 0 && (
            <ul className="keys">
              {keys.map((k, i) => (<li key={i}><b>{k.g}</b> — {k.n}</li>))}
            </ul>
          )}
        </>
      ),
    });
  }

  if (item.mnemo) blocks.push({ title: "Moyen mnémotechnique", body: <p>{item.mnemo}</p> });
  if (item.origin) blocks.push({ title: "Origine du caractère", body: <p>{item.origin}</p> });

  if (item.cn?.has) {
    blocks.push({
      title: "Lien avec le chinois",
      body: (
        <>
          <p><b style={{ fontSize: 20 }}>{item.cn.glyph}</b> · {item.cn.pinyin}{item.cn.hsk ? ` · ${item.cn.hsk}` : ""}</p>
          <p>{item.cn.note}</p>
        </>
      ),
    });
  }

  if (examples.length > 0) {
    blocks.push({
      title: "Phrases d'exemple",
      body: (
        <ul className="examples">
          {examples.map((ex, i) => (
            <li key={i}>
              <div className="ex-jp"><WordText text={ex.jp} /></div>
              <div className="ex-yomi">{ex.yomi}</div>
              <div className="ex-fr">{ex.fr}</div>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (confuse.length > 0) {
    blocks.push({
      title: item.confuseTitle ?? "À ne pas confondre",
      body: (
        <ul className="confuse">
          {confuse.map((c, i) => (<li key={i}><b>{c.g}</b> ({c.n}) — <WordText text={c.d} /></li>))}
        </ul>
      ),
    });
  }

  if (item.patterns && item.patterns.rows.length > 0) {
    blocks.push({
      title: item.patterns.title ?? "Mots & expressions courants",
      body: (
        <>
          {item.patterns.label && <span className="group-badge">{item.patterns.label}</span>}
          <table className="conj"><tbody>
            {item.patterns.rows.map((row, i) => (
              <tr key={i}><td>{row[0]}</td><td>{row[1]}</td></tr>
            ))}
          </tbody></table>
        </>
      ),
    });
  }

  return (
    <>
      <div className="drawer-hero">
        <div className="dh-glyph">{item.lemma}</div>
        <div className="dh-meta">
          <span className="badge-type">{VOCAB_TYPE_LABELS[item.type] ?? item.type}</span>
          {item.level && <span className="jlpt-badge">{item.level}</span>}
          {item.reading && <div className="dh-reading">{item.reading}</div>}
          <div className="dh-gloss">{item.gloss}</div>
        </div>
      </div>

      {blocks.map((b, i) => (
        <section className="block" key={i}>
          <h3 className="block-title">
            {numbered && <span className="block-num">{String(i + 1).padStart(2, "0")}</span>}
            {b.title}
          </h3>
          <div className="block-body">{b.body}</div>
        </section>
      ))}
    </>
  );
}
