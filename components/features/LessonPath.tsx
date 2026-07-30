"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";
import { getLevelLessons } from "@/lib/curriculum";
import { getValidated } from "@/lib/lesson-progress";
import { computeDragon, xpFromValidated, type DragonStage } from "@/lib/dragon";
import { canOpenLesson, canOpenExam, type Access } from "@/lib/access";

/** Le plan ne connaît qu'un booléen « tout ouvert » : le détail du rôle et de
 *  l'abonnement reste côté serveur, où il est vérifiable. */
const ACCESS = (fullAccess: boolean): Access => ({ isAdmin: false, isPro: fullAccess });

/**
 * Parcours d'étude — tous les niveaux JLPT (N5 → N1) sont ouverts : l'accès aux
 * leçons ne dépend d'aucun abonnement, seulement de l'accès à l'application.
 *
 * Les leçons sont présentées en boutons simples (grille numérotée), et non plus
 * sur les cartes d'aventure illustrées. Les illustrations et le cadre zoomable
 * (MapViewport, public/roadmap/…) sont conservés pour un usage ultérieur.
 */

function PathDragon({ stage }: { stage: DragonStage }) {
  const [failed, setFailed] = useState(false);
  if (failed || !stage.img) return <span className="lesson-dragon-emoji" aria-hidden>{stage.emoji}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="lesson-dragon-img" src={stage.img} alt="" onError={() => setFailed(true)} />
  );
}

export function LessonPath({ fullAccess = false }: { fullAccess?: boolean }) {
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

  const dragon = computeDragon(xpFromValidated(validated));

  return (
    <div className="levels">
      {JLPT_LEVELS.map((lv) => {
        const lessons = getLevelLessons(lv);
        const total = lessons.length;
        const isDone = (l: (typeof lessons)[number]) => l.codes.length > 0 && l.codes.every((c) => validated.has(c));
        const doneCount = lessons.filter(isDone).length;
        const currentNum = (lessons.find((l) => !isDone(l)) ?? lessons[lessons.length - 1])?.num ?? 1;

        return (
          <section key={lv} className="level-block">
            <header className="level-head">
              <span className="level-badge">{lv}</span>
              <div className="level-head-txt">
                <b>{LEVEL_LABELS[lv]}</b>
                <span>{total} leçon{total > 1 ? "s" : ""}</span>
              </div>
              <span className="level-prog">{doneCount} / {total} validées</span>
            </header>

            <div className="lesson-grid">
              {lessons.map((l) => {
                const done = isDone(l);
                const current = l.num === currentNum;
                const open = canOpenLesson(lv, l.num, ACCESS(fullAccess));
                const state = !open ? "locked" : done ? "done" : current ? "current" : "todo";
                const title =
                  l.modules.find((m) => m.track === "vocab")?.lesson.title ??
                  l.modules[0]?.lesson.title ??
                  "";
                const label = title ? `Leçon ${l.num} — ${title}` : `Leçon ${l.num}`;

                // Verrouillée : un <span>, pas un lien. Rien à cliquer, rien à
                // ouvrir dans un nouvel onglet, rien à survoler pour deviner.
                if (!open) {
                  return (
                    <span
                      key={l.num}
                      className="lesson-btn locked"
                      title={`Leçon ${l.num} — réservée aux abonnés`}
                      aria-disabled="true"
                    >
                      <span className="lesson-btn-lock" aria-hidden>🔒</span>
                    </span>
                  );
                }

                return (
                  <Link
                    key={l.num}
                    href={`/lecon/${lv}/${l.num}` as Route}
                    className={`lesson-btn ${state}`}
                    title={label}
                  >
                    {current && <span className="lesson-dragon"><PathDragon stage={dragon.stage} /></span>}
                    <span className="lesson-btn-n">{l.num}</span>
                    {done && <span className="lesson-btn-ck" aria-hidden>✓</span>}
                  </Link>
                );
              })}
            </div>

            {/* Boss de fin de niveau = examen */}
            {canOpenExam(lv, ACCESS(fullAccess)) ? (
              <Link href={`/examen/${lv}` as Route} className="level-exam">
                <span className="level-exam-ic" aria-hidden>👹</span>
                <span className="level-exam-txt">
                  <b>Examen du niveau {lv}</b>
                  <span>Affronte le boss pour valider {LEVEL_LABELS[lv].toLowerCase()}</span>
                </span>
                <span className="level-exam-go" aria-hidden>→</span>
              </Link>
            ) : (
              <Link href={"/abonnement" as Route} className="level-exam is-locked">
                <span className="level-exam-ic" aria-hidden>🔒</span>
                <span className="level-exam-txt">
                  <b>Niveau {lv} réservé aux abonnés</b>
                  <span>Ouvre {LEVEL_LABELS[lv].toLowerCase()} et tout le parcours</span>
                </span>
                <span className="level-exam-go" aria-hidden>→</span>
              </Link>
            )}
          </section>
        );
      })}
    </div>
  );
}
