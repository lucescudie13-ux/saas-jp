"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons, TRACK_LABELS } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";
import { computeDragon, countSteps, DRAGON_STAGES, type DragonStage } from "@/lib/dragon";
import { getDragonName, DEFAULT_DRAGON_NAME } from "@/lib/dragon-name";
import { SkillStats } from "./SkillStats";

/**
 * Illustration d'un stade. Affiche le vrai visuel (public/dragons/<key>.png) et
 * bascule automatiquement sur l'emoji tant que le fichier n'est pas fourni
 * (ou s'il ne charge pas). Aucune config Next/Image requise.
 */
function DragonArt({ stage, size }: { stage: DragonStage; size: "hero" | "node" | "compact" }) {
  const [failed, setFailed] = useState(false);
  if (failed || !stage.img) {
    return <span className="dragon-emoji" role="img" aria-label={stage.name}>{stage.emoji}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`dragon-art dragon-art-${size}`}
      src={stage.img}
      alt={`Dragon — ${stage.name}`}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Compagnon dragon (gamification). Le dragon évolue avec les leçons validées :
 * chaque module rapporte de l'XP, l'XP donne un niveau (barre) et un stade
 * d'évolution (l'apparence). Tout est dérivé de lib/lesson-progress, donc la
 * vue se met à jour instantanément quand on valide/annule une leçon.
 *
 * `variant="compact"` = petite carte pour l'accueil ; `"full"` = la page dédiée.
 */
export function DragonView({ level, variant = "full" }: { level: JlptLevel; variant?: "full" | "compact" | "sidebar" }) {
  const [validated, setValidated] = useState<Set<string>>(new Set());
  const [dragonName, setDragonNameState] = useState(DEFAULT_DRAGON_NAME);

  useEffect(() => {
    const refresh = () => setValidated(getValidated());
    const refreshName = () => setDragonNameState(getDragonName());
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

  // Ensemble de tous les codes de modules du curriculum (tous niveaux) : sert
  // à ne compter comme XP que les vraies leçons validées.
  const allCodes = useMemo(() => {
    const set = new Set<string>();
    for (const lvl of JLPT_LEVELS) {
      for (const lesson of getLevelLessons(lvl)) {
        for (const code of lesson.codes) set.add(code);
      }
    }
    return set;
  }, []);

  const lessonsDone = useMemo(
    () => countSteps(validated, allCodes),
    [validated, allCodes],
  );

  const d = computeDragon(lessonsDone, allCodes.size);
  const isLegendary = d.stage.key === "legendary";

  // Prochaine leçon à faire dans le niveau de l'utilisateur.
  const lessons = getLevelLessons(level);
  const isDone = (l: (typeof lessons)[number]) => l.codes.length > 0 && l.codes.every((c) => validated.has(c));
  const next = lessons.find((l) => !isDone(l)) ?? lessons[0] ?? null;
  const nextModulesDone = next ? next.codes.filter((c) => validated.has(c)).length : 0;

  const medallion = (size: "hero" | "compact") => (
    <div
      className={`dragon-medallion ${isLegendary ? "legendary" : ""}`}
      style={{ ["--aura" as string]: d.stage.color }}
    >
      <DragonArt stage={d.stage} size={size} />
      {isLegendary && <span className="dragon-flame" aria-hidden>🔥</span>}
    </div>
  );

  // ---------- Barre latérale : dragon nommé + niveau + XP ----------
  if (variant === "sidebar") {
    return (
      <Link href={"/dragon" as Route} className="dragon-side">
        {medallion("compact")}
        <div className="dragon-side-body">
          <div className="dragon-side-name">{dragonName}</div>
          <div className="dragon-side-top">
            <span className="dragon-side-stage">{d.stage.name}</span>
            <span className="dragon-lvl">Niv. {d.level}</span>
          </div>
          <div className="bar"><i style={{ width: `${d.levelPct}%` }} /></div>
          <span className="dragon-side-xp">EXP {d.xpIntoLevel} / {d.xpForLevel}</span>
        </div>
      </Link>
    );
  }

  // ---------- Variante compacte (réutilisable) ----------
  if (variant === "compact") {
    return (
      <Link href={"/dragon" as Route} className="dragon-compact">
        {medallion("compact")}
        <div className="dragon-compact-body">
          <div className="dragon-compact-top">
            <b>{dragonName}</b>
            <span className="dragon-lvl">Niv. {d.level}</span>
          </div>
          <div className="bar"><i style={{ width: `${d.levelPct}%` }} /></div>
          <span className="dragon-compact-xp">{d.stage.name} · EXP {d.xpIntoLevel} / {d.xpForLevel}</span>
        </div>
      </Link>
    );
  }

  // ---------- Variante complète (page dédiée) ----------
  return (
    <div className="dragon-wrap">
      {/* Carte principale : le dragon + niveau + XP */}
      <section className="dragon-hero">
        <div className="dragon-hero-glow" aria-hidden style={{ ["--aura" as string]: d.stage.color }} />
        {medallion("hero")}
        <div className="dragon-hero-info">
          <h2 className="dragon-stage-name">{dragonName}</h2>
          <p className="dragon-stage-tagline">{d.stage.tagline}</p>

          <div className="dragon-level-row">
            <span className="dragon-level-badge">Niveau {d.level}</span>
            <span className="dragon-level-xp">EXP {d.xpIntoLevel} / {d.xpForLevel}</span>
            <span className="dragon-level-pct">{d.levelPct}%</span>
          </div>
          <div className="bar"><i style={{ width: `${d.levelPct}%` }} /></div>
          <p className="dragon-hint">
            {d.nextStage
              ? <>Encore <b>{Math.ceil(d.xpToNextStage / 100)}</b> leçon{Math.ceil(d.xpToNextStage / 100) > 1 ? "s" : ""} pour évoluer en <b>{d.nextStage.name}</b>.</>
              : <>Ton dragon a atteint sa forme <b>légendaire</b>. 🎉</>}
          </p>
        </div>
      </section>

      {/* Prochaine étape */}
      <section className="dragon-next panel">
        <div>
          <span className="dragon-eyebrow">Prochaine étape</span>
          {next ? (
            <>
              <h3>Leçon {next.num} · {level}</h3>
              <p>
                {next.modules.map((m) => TRACK_LABELS[m.track]).join(" · ")} — {nextModulesDone}/{next.codes.length} modules validés.
              </p>
            </>
          ) : (
            <>
              <h3>Les leçons du niveau {level} arrivent bientôt</h3>
              <p>Choisis un autre niveau depuis le plan d&apos;étude en attendant.</p>
            </>
          )}
        </div>
        <Link className="btn primary" href={(next ? "/aujourdhui" : "/plan") as Route}>
          {next ? "Continuer →" : "Voir le plan →"}
        </Link>
      </section>

      {/* Compétences (0–100) */}
      <SkillStats level={level} variant="full" />

      {/* Chronologie d'évolution */}
      <section>
        <h3 className="dragon-section-title">Évolution du dragon</h3>
        <ol className="dragon-timeline">
          {DRAGON_STAGES.map((s, i) => {
            const reached = i <= d.stageIndex;
            const current = i === d.stageIndex;
            return (
              <li key={s.key} className={`dragon-node ${reached ? "reached" : ""} ${current ? "current" : ""}`}>
                <span className="dragon-node-emoji" style={{ ["--aura" as string]: s.color }}>
                  {reached ? <DragonArt stage={s} size="node" /> : <span className="dragon-lock" aria-hidden>🔒</span>}
                </span>
                <span className="dragon-node-name">{s.name}</span>
                <span className="dragon-node-tag">{s.tagline}</span>
                <span className="dragon-node-xp">{s.minXp === 0 ? "Départ" : `${s.minXp} XP`}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Personnalisation — aperçu (à venir) */}
      <section className="dragon-perso panel">
        <div className="dragon-perso-head">
          <div>
            <span className="dragon-eyebrow">Personnalisation</span>
            <h3>Rends ton dragon unique</h3>
          </div>
          <span className="dragon-soon">Bientôt</span>
        </div>
        <div className="dragon-perso-grid">
          {[
            { label: "Cornes", icon: "🦬" },
            { label: "Ailes", icon: "🪽" },
            { label: "Queues", icon: "🐉" },
            { label: "Gemmes", icon: "💎" },
          ].map((p) => (
            <div key={p.label} className="dragon-perso-item">
              <span>{p.icon}</span>
              {p.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
