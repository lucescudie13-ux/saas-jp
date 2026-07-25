"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";
import { computeDragon, type DragonStage } from "@/lib/dragon";
import { MapViewport } from "./MapViewport";
import { SubscribeButton } from "./SubscribeButton";

/**
 * « La route du dragon » — une carte d'aventure par niveau JLPT, toutes
 * affichées à la suite. Le niveau débloqué est interactif ; les suivants sont
 * verrouillés (nœuds visibles mais non cliquables + bouton « Débloquer »).
 *
 * Chaque niveau a sa propre illustration (public/roadmap/…) et son propre tracé
 * de route : les waypoints (x%, y%) suivent la route peinte de l'image, et les
 * nœuds de leçon sont répartis dessus. Ainsi les boutons tombent pile sur la route.
 */

// Niveaux débloqués. À brancher plus tard sur l'abonnement de l'utilisateur.
// N5 est toujours ouvert ; N4→N1 se débloquent avec l'abonnement Pro.
const FREE_LEVEL: JlptLevel = "N5";

type WP = { xs: number[]; ys: number[] };

const LEVEL_MAP: Record<JlptLevel, string> = {
  N5: "/roadmap/adventure-map.webp",
  N4: "/roadmap/roadmap-n4.webp",
  N3: "/roadmap/roadmap-n3.webp",
  N2: "/roadmap/roadmap-n2.webp",
  N1: "/roadmap/roadmap-n1.webp",
};

// Tracés relevés sur chaque illustration (route principale, du départ au temple).
const LEVEL_WP: Record<JlptLevel, WP> = {
  N5: {
    xs: [3, 7, 11, 14, 20, 23, 26, 29, 33, 36, 39, 42, 45, 48, 51, 55, 58, 61, 64, 67, 70, 73, 76, 80, 83, 86, 89, 91, 93],
    ys: [41, 47, 52, 54, 46, 47, 53, 55, 51, 51, 56, 58, 50, 41, 41, 47, 55, 56, 55, 45, 43, 46, 54, 57, 55, 49, 41, 30, 19],
  },
  N4: {
    xs: [1, 4, 7, 10, 13, 16, 20, 24, 28, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59, 62, 66, 70, 73, 77, 80, 83, 86, 89, 92, 94],
    ys: [42, 38, 36, 41, 44, 42, 42, 41, 41, 45, 47, 47, 45, 42, 38, 32, 29, 29, 31, 36, 41, 52, 57, 52, 45, 39, 33, 26, 19, 15],
  },
  N3: {
    xs: [4, 7, 10, 13, 16, 20, 24, 28, 32, 36, 40, 43, 47, 51, 55, 58, 61, 64, 67, 70, 73, 76, 79, 82, 85, 88, 90, 92],
    ys: [40, 43, 47, 49, 50, 50, 50, 51, 53, 56, 58, 58, 56, 53, 51, 52, 56, 61, 66, 71, 67, 59, 52, 45, 38, 30, 23, 19],
  },
  N2: {
    xs: [5, 8, 11, 14, 17, 20, 24, 28, 31, 33, 36, 38, 41, 44, 47, 50, 53, 56, 59, 63, 66, 69, 72, 75, 78, 81, 84, 87, 89, 91],
    ys: [31, 40, 48, 54, 55, 51, 47, 48, 47, 53, 59, 63, 59, 53, 48, 44, 43, 45, 49, 53, 57, 60, 58, 52, 46, 40, 34, 28, 22, 16],
  },
  N1: {
    xs: [7, 9, 11, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58, 61, 64, 67, 69, 72, 75, 78, 81, 84, 87, 90],
    ys: [38, 44, 50, 52, 47, 44, 43, 46, 49, 50, 51, 52, 57, 61, 58, 53, 47, 42, 39, 45, 52, 59, 62, 57, 51, 46, 41, 34, 25, 17],
  },
};

// Antre du boss (examen) = temple/portail final de chaque carte.
const LEVEL_BOSS: Record<JlptLevel, [number, number]> = {
  N5: [93, 12], N4: [96, 9], N3: [94, 13], N2: [94, 11], N1: [93, 11],
};

// Taille des nœuds (px) et de leur libellé, adaptée au nombre de leçons.
const LEVEL_NODE: Record<JlptLevel, { s: number; f: number }> = {
  N5: { s: 42, f: 15 }, N4: { s: 32, f: 13 }, N3: { s: 29, f: 12 }, N2: { s: 27, f: 11 }, N1: { s: 21, f: 10 },
};

function pointAt(wp: WP, t: number): { x: number; y: number } {
  const n = wp.xs.length;
  const seg = Math.max(0, Math.min(1, t)) * (n - 1);
  const i = Math.min(n - 2, Math.floor(seg));
  const f = seg - i;
  return {
    x: wp.xs[i]! + (wp.xs[i + 1]! - wp.xs[i]!) * f,
    y: wp.ys[i]! + (wp.ys[i + 1]! - wp.ys[i]!) * f,
  };
}

function PathDragon({ stage }: { stage: DragonStage }) {
  const [failed, setFailed] = useState(false);
  if (failed || !stage.img) return <span className="map-dragon-emoji" aria-hidden>{stage.emoji}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="map-dragon-img" src={stage.img} alt="" onError={() => setFailed(true)} />
  );
}

export function LessonPath({ premium = false }: { premium?: boolean }) {
  const [validated, setValidated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setValidated(getValidated());
    refresh();
    window.addEventListener("hibi-progress", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("hibi-progress", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const allCodes = useMemo(() => {
    const set = new Set<string>();
    for (const lv of JLPT_LEVELS) for (const l of getLevelLessons(lv)) for (const c of l.codes) set.add(c);
    return set;
  }, []);
  const dragon = computeDragon([...validated].filter((c) => allCodes.has(c)).length, allCodes.size);

  return (
    <div className="levels">
      {JLPT_LEVELS.map((lv) => {
        const unlocked = premium || lv === FREE_LEVEL;
        const lessons = getLevelLessons(lv);
        const total = lessons.length;
        const wp = LEVEL_WP[lv];
        const node = LEVEL_NODE[lv];
        const boss = LEVEL_BOSS[lv];
        const isDone = (l: (typeof lessons)[number]) => l.codes.length > 0 && l.codes.every((c) => validated.has(c));
        const doneCount = lessons.filter(isDone).length;
        const currentNum = (lessons.find((l) => !isDone(l)) ?? lessons[lessons.length - 1])?.num ?? 1;

        return (
          <section key={lv} className={`level-block ${unlocked ? "" : "locked"}`}>
            <header className="level-head">
              <span className="level-badge">{lv}</span>
              <div className="level-head-txt">
                <b>{LEVEL_LABELS[lv]}</b>
                <span>{total} leçon{total > 1 ? "s" : ""}</span>
              </div>
              {unlocked && <span className="level-prog">{doneCount} / {total} validées</span>}
            </header>

            {unlocked ? (
              <MapViewport>
                <div
                  className="map-inner"
                  style={{
                    backgroundImage: `url("${LEVEL_MAP[lv]}")`,
                    ["--ns" as string]: `${node.s}px`,
                    ["--nfs" as string]: `${node.f}px`,
                  }}
                >
                  {lessons.map((l, i) => {
                    const { x, y } = pointAt(wp, total > 1 ? i / (total - 1) : 0);
                    const done = isDone(l);
                    const current = l.num === currentNum;
                    const state = done ? "done" : current ? "current" : "todo";
                    return (
                      <div className="map-step" key={l.num} style={{ left: `${x}%`, top: `${y}%` }}>
                        {current && <span className="map-dragon"><PathDragon stage={dragon.stage} /></span>}
                        <Link href={`/lecon/${lv}/${l.num}` as Route} className={`map-node ${state}`} title={`Leçon ${l.num}`}>
                          {done ? <span aria-hidden>✓</span> : l.num}
                        </Link>
                      </div>
                    );
                  })}

                  {/* Boss final = examen du niveau, à l'antre du dragon (temple) */}
                  <div className="map-step map-boss" style={{ left: `${boss[0]}%`, top: `${boss[1]}%` }}>
                    <Link href={`/examen/${lv}` as Route} className="map-node boss" title={`Examen — Niveau ${lv}`}>👹</Link>
                    <span className="map-boss-label">Examen</span>
                  </div>
                </div>
              </MapViewport>
            ) : (
              <div className="map-preview" style={{ backgroundImage: `url("${LEVEL_MAP[lv]}")` }}>
                <div className="map-lock-scrim">
                  <div className="map-lock">
                    <span className="map-lock-ic" aria-hidden>🔒</span>
                    <div className="map-lock-title">Niveau {lv} · {LEVEL_LABELS[lv]}</div>
                    <p>Débloque ce niveau pour ouvrir sa route et faire évoluer ton dragon.</p>
                    <SubscribeButton label={`Débloquer ${lv} →`} className="btn map-lock-cta" />
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
