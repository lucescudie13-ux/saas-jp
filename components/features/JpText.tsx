"use client";

import { useEffect, useRef, useState } from "react";
import type { VracToken } from "@/lib/vrac";

/**
 * Phrase japonaise interactive : chaque mot doté d'une fiche s'ouvre au survol
 * (ordinateur) ou au clic / toucher (mobile), et affiche lecture, nature et sens.
 * Fermeture au clic extérieur ou avec Échap. Les données viennent pour l'instant
 * des `tokens` fournis ; elles seront branchées sur la vraie base plus tard.
 */
export function JpText({ tokens, size }: { tokens: VracToken[]; size?: "sm" }) {
  const [active, setActive] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (active === null) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setActive(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <span className={`jp-text${size === "sm" ? " jp-text-sm" : ""}`} ref={ref} onMouseLeave={() => setActive(null)}>
      {tokens.map((t, i) => {
        const interactive = !t.plain && (t.meaning || t.reading);
        if (!interactive) return <span key={i} className="jp-plain">{t.w}</span>;

        const open = active === i;
        return (
          <span
            key={i}
            className={`jp-word ${open ? "open" : ""}`}
            tabIndex={0}
            role="button"
            aria-expanded={open}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(open ? null : i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(open ? null : i); }
            }}
          >
            {t.w}
            {open && (
              <span className="jp-pop" role="tooltip">
                <span className="jp-pop-head">
                  <span className="jp-pop-w">{t.w}</span>
                  {t.pos && <span className="jp-pop-pos">{t.pos}</span>}
                </span>
                {t.reading && <span className="jp-pop-reading">{t.reading}</span>}
                {t.meaning && <span className="jp-pop-meaning">{t.meaning}</span>}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
