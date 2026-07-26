"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";

/**
 * Rend un texte japonais en rendant chaque groupe de kanji survolable / cliquable :
 * une info-bulle affiche la lecture, la traduction et un lien vers la fiche du mot.
 * Les mots hors programme n'affichent rien de spécial.
 */
type Look = { slug: string; lemma: string; reading: string | null; gloss: string; level: string } | null;
const cache = new Map<string, Look>();
const KANJI = /([㐀-鿿々〆ヶ]+)/;

function WordSpan({ w }: { w: string }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Look | undefined>(cache.get(w));
  const [loading, setLoading] = useState(false);

  async function load() {
    if (cache.has(w)) { setData(cache.get(w)); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/vocab/lookup?q=${encodeURIComponent(w)}`);
      const body = await res.json();
      const d: Look = body?.data ?? null;
      cache.set(w, d); setData(d);
    } catch { cache.set(w, null); setData(null); }
    setLoading(false);
  }
  const show = () => { setOpen(true); void load(); };
  const hide = () => setOpen(false);

  return (
    <span
      className="wt-word"
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={(e) => { e.stopPropagation(); open ? hide() : show(); }}
    >
      {w}
      {open && (
        <span className="wt-pop" onClick={(e) => e.stopPropagation()}>
          {loading && data === undefined ? (
            <span className="wt-muted">…</span>
          ) : data ? (
            <>
              <span className="wt-read">{data.reading || data.lemma}</span>
              <span className="wt-gloss">{data.gloss}</span>
              <Link className="wt-link" href={`/mot/${data.slug}` as Route}>Voir la fiche →</Link>
            </>
          ) : (
            <span className="wt-muted">Hors programme</span>
          )}
        </span>
      )}
    </span>
  );
}

export function WordText({ text }: { text: string }) {
  const parts = text.split(KANJI);
  return (
    <>
      {parts.map((p, i) =>
        p && KANJI.test(p) ? <WordSpan key={i} w={p} /> : <span key={i}>{p}</span>
      )}
    </>
  );
}
