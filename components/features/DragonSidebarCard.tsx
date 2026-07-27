"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";
import { computeDragon, countSteps, type DragonStage } from "@/lib/dragon";
import { computeSkills } from "@/lib/skills";
import { getDragonName, DEFAULT_DRAGON_NAME } from "@/lib/dragon-name";

/**
 * Carte de la barre latérale : le dragon (illustration + nom cliquables vers le
 * profil), ses compétences, puis « Prochaine étape » — la leçon en cours avec
 * sa barre de progression et le bouton Continuer.
 */

function DragonArt({ stage }: { stage: DragonStage }) {
  const [failed, setFailed] = useState(false);
  if (failed || !stage.img) {
    return <span className="dsc-emoji" role="img" aria-label={stage.name}>{stage.emoji}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="dsc-art" src={stage.img} alt={stage.name} onError={() => setFailed(true)} />
  );
}

export function DragonSidebarCard({ level }: { level: JlptLevel }) {
  const [validated, setValidated] = useState<Set<string>>(new Set());
  const [name, setName] = useState(DEFAULT_DRAGON_NAME);

  useEffect(() => {
    const refresh = () => setValidated(getValidated());
    const refreshName = () => setName(getDragonName());
    refresh();
    refreshName();
    window.addEventListener("hibi-progress", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("hibi-dragon-name", refreshName);
    window.addEventListener("storage", refreshName);
    return () => {
      window.removeEventListener("hibi-progress", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("hibi-dragon-name", refreshName);
      window.removeEventListener("storage", refreshName);
    };
  }, []);

  const allCodes = useMemo(() => {
    const set = new Set<string>();
    for (const lv of JLPT_LEVELS) for (const l of getLevelLessons(lv)) for (const c of l.codes) set.add(c);
    return set;
  }, []);
  const lessonsDone = useMemo(() => countSteps(validated, allCodes), [validated, allCodes]);

  const d = computeDragon(lessonsDone, allCodes.size);
  const { skills, general } = computeSkills(validated, level);
  const isLegendary = d.stage.key === "legendary";

  // Leçon en cours (prochaine étape) du niveau de l'utilisateur.
  const lessons = getLevelLessons(level);
  const isLessonDone = (l: (typeof lessons)[number]) => l.codes.length > 0 && l.codes.every((c) => validated.has(c));
  const next = lessons.find((l) => !isLessonDone(l)) ?? lessons[lessons.length - 1] ?? null;
  const nextTotal = next ? next.codes.length : 0;
  const nextDone = next ? next.codes.filter((c) => validated.has(c)).length : 0;
  const nextPct = nextTotal ? Math.round((nextDone / nextTotal) * 100) : 0;
  const nextName = next ? next.modules.find((m) => m.track === "vocab")?.lesson.title ?? next.modules[0]?.lesson.title ?? "" : "";

  return (
    <div className="dsc">
      <Link href={"/dragon" as Route} className="dsc-top" aria-label={`${name} — voir le profil détaillé`}>
        <div className={`dsc-scene ${isLegendary ? "legendary" : ""}`} style={{ ["--aura" as string]: d.stage.color }}>
          <span className="dsc-halo" aria-hidden />
          <span className="dsc-spark s1" aria-hidden>✦</span>
          <span className="dsc-spark s2" aria-hidden>✦</span>
          <span className="dsc-spark s3" aria-hidden>✧</span>
          <span className="dsc-spark s4" aria-hidden>✦</span>
          <span className="dsc-spark s5" aria-hidden>✧</span>
          <span className="dsc-nest" aria-hidden />
          <div className="dsc-egg">
            <DragonArt stage={d.stage} />
            {isLegendary && <span className="dsc-flame" aria-hidden>🔥</span>}
          </div>
        </div>
        <div className="dsc-name">{name} <span className="dsc-name-ar" aria-hidden>›</span></div>
        <div className="dsc-sub">
          <span className="dsc-stage">{d.stage.name}</span>
          <span className="dsc-lvl">Niv. {d.level}</span>
        </div>
        <div className="dsc-bar"><i style={{ width: `${d.levelPct}%` }} /></div>
        <div className="dsc-xp">EXP {d.levelPct} / 100</div>
      </Link>

      <div className="dsc-skills">
        {skills.map((s) => (
          <div className="dsc-skill" key={s.key} title={s.label}>
            <span className="dsc-skill-l">{s.short}</span>
            <span className="dsc-skill-bar"><i style={{ width: `${s.value}%`, background: s.color }} /></span>
            <span className="dsc-skill-v">{s.value}</span>
          </div>
        ))}
        <div className="dsc-skill dsc-gen">
          <span className="dsc-skill-l">Général</span>
          <span className="dsc-skill-bar"><i style={{ width: `${general}%` }} /></span>
          <span className="dsc-skill-v">{general}</span>
        </div>
      </div>

      {next && (
        <div className="dsc-next">
          <div className="dsc-next-label">Prochaine étape</div>
          <div className="dsc-next-lesson">Leçon {next.num} · {nextName}</div>
          <div className="dsc-next-bar"><i style={{ width: `${nextPct}%` }} /></div>
          <div className="dsc-next-foot">{nextDone}/{nextTotal} modules</div>
          <Link href={"/aujourdhui" as Route} className="btn dsc-continue">Continuer →</Link>
        </div>
      )}
    </div>
  );
}
