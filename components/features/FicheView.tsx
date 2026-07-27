"use client";

import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { WordText } from "./WordText";

/** Blocs d'analyse d'un kanji (issus des fiches PDF). */
type KanjiBlock = { char: string; meta?: string; trace?: string; origine?: string; decomp?: string; mnemo?: string };
type FicheReading = { k: string; v?: string; prec?: string };
type FicheExample = { jp: string; yomi?: string; fr: string };

/** Sous-ensemble d'une ligne vocab_items suffisant pour afficher la fiche détaillée. */
export interface FicheItem {
  lemma: string;
  type: string;
  level?: string;
  reading?: string | null;
  gloss: string;
  usage?: string | null;
  examples?: FicheExample[] | null;
  readings?: FicheReading[] | null;
  confuse?: Array<{ d?: string }> | null;
  keys?: KanjiBlock[] | null;
  sens?: { categoryBlock?: string | null; frequency?: string | null; verbGroup?: string | null } | null;
}

/** Une fiche a-t-elle du contenu détaillé chargé (sinon on retombe sur le socle) ? */
export function hasFiche(item: FicheItem): boolean {
  return Boolean(item.usage || (item.examples && item.examples.length) || (item.keys && item.keys.length));
}

/**
 * Fiche de vocabulaire détaillée, fidèle au gabarit des PDF :
 * lectures & traductions · contexte & usage · exemples · à ne pas confondre ·
 * bloc catégorie · analyse kanji par caractère.
 */
export function FicheView({ item }: { item: FicheItem }) {
  const readings = (item.readings || []).filter((r) => r && r.k);
  const examples = (item.examples || []).filter((e) => e && (e.jp || e.fr));
  const kanji = (item.keys || []).filter((k) => k && k.char);
  const confuse = (item.confuse || []).map((c) => c?.d).filter(Boolean) as string[];
  const catBlock = item.sens?.categoryBlock;
  const freq = item.sens?.frequency;

  return (
    <>
      <div className="drawer-hero">
        <div className="dh-glyph">{item.lemma}</div>
        <div className="dh-meta">
          <span className="badge-type">{VOCAB_TYPE_LABELS[item.type] ?? item.type}</span>
          {item.level && <span className="jlpt-badge">{item.level}</span>}
          {freq && <span className="freq-badge">{freq}</span>}
          {item.reading && <div className="dh-reading">{item.reading}</div>}
          <div className="dh-gloss">{item.gloss}</div>
        </div>
      </div>

      {readings.length > 0 && (
        <section className="block">
          <h3 className="block-title">Lectures et traductions</h3>
          <div className="block-body">
            <ul className="fiche-readings">
              {readings.map((r, i) => (
                <li key={i}>
                  <span className="fr-kana">{r.k}</span>
                  <span className="fr-body">
                    {r.v && <span className="fr-tr">{r.v}</span>}
                    {r.prec && <span className="fr-prec">{r.prec}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {item.usage && (
        <section className="block">
          <h3 className="block-title">Contexte et usage</h3>
          <div className="block-body"><p><WordText text={item.usage} /></p></div>
        </section>
      )}

      {examples.length > 0 && (
        <section className="block">
          <h3 className="block-title">Exemples</h3>
          <div className="block-body">
            <ul className="examples">
              {examples.map((ex, i) => (
                <li key={i}>
                  <div className="ex-jp"><WordText text={ex.jp} /></div>
                  {ex.fr && <div className="ex-fr">{ex.fr}</div>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {confuse.length > 0 && (
        <section className="block">
          <h3 className="block-title">À ne pas confondre</h3>
          <div className="block-body">{confuse.map((d, i) => <p key={i}><WordText text={d} /></p>)}</div>
        </section>
      )}

      {catBlock && (
        <section className="block">
          <h3 className="block-title">Forme &amp; catégorie</h3>
          <div className="block-body"><p className="fiche-cat">{catBlock}</p></div>
        </section>
      )}

      {kanji.length > 0 && (
        <section className="block">
          <h3 className="block-title">Analyse des kanji</h3>
          <div className="block-body">
            {kanji.map((k, i) => (
              <div className="fiche-kanji" key={i}>
                <div className="fk-head"><span className="fk-char">{k.char}</span>{k.meta && <span className="fk-meta">{k.meta}</span>}</div>
                {k.trace && <p><b>Ordre de tracé — </b><WordText text={k.trace} /></p>}
                {k.origine && <p><b>Origine — </b><WordText text={k.origine} /></p>}
                {k.decomp && <p><b>Décomposition &amp; clé — </b><WordText text={k.decomp} /></p>}
                {k.mnemo && <p><b>Mnémotechnique — </b><WordText text={k.mnemo} /></p>}
              </div>
            ))}
          </div>
        </section>
      )}

    </>
  );
}
