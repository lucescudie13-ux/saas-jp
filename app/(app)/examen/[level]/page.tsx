import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";

// Examen final = le « boss » du niveau. Page maquette pour l'instant.
export default async function ExamenPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  if (!JLPT_LEVELS.includes(level as JlptLevel)) notFound();
  const lv = level as JlptLevel;

  return (
    <>
      <div className="page-head">
        <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
        <span className="pill-tag">{lv} · Examen</span>
        <h1>Le boss du niveau {lv}</h1>
      </div>

      <div className="exam-hero">
        <div className="exam-boss" aria-hidden>👹</div>
        <h2>Affronte le boss — {LEVEL_LABELS[lv]}</h2>
        <p>
          L&apos;examen final du niveau {lv} : un défi qui reprend tout ce que tu as appris —
          vocabulaire, grammaire, conjugaison et compréhension. Le vaincre valide le niveau
          et fait franchir un cap à ton dragon.
        </p>
        <span className="btn exam-cta" aria-disabled>Commencer l&apos;examen →</span>
        <span className="exam-soon">🔒 Bientôt — en construction</span>
      </div>
    </>
  );
}
