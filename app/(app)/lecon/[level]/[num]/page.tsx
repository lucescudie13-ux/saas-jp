import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import { getCombinedLesson, levelLessonCount } from "@/lib/curriculum";
import { LessonRoadmap } from "@/components/features/LessonRoadmap";
import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { getAccess, getValidatedCodes } from "@/server/access/access.service";
import { lessonLock, LOCKED_MESSAGE } from "@/lib/access";
import { getLevelLessons } from "@/lib/curriculum";

export default async function LeconPage({ params }: { params: Promise<{ level: string; num: string }> }) {
  const { level, num } = await params;
  if (!JLPT_LEVELS.includes(level as JlptLevel)) notFound();
  const n = Number(num);
  if (!Number.isInteger(n)) notFound();
  const lesson = getCombinedLesson(level as JlptLevel, n);
  if (!lesson) notFound();

  const total = levelLessonCount(level as JlptLevel);
  const nextHref = n < total ? (`/lecon/${level}/${n + 1}` as Route) : null;

  const vocabMod = lesson.modules.find((m) => m.track === "vocab");
  const grammarMod = lesson.modules.find((m) => m.track === "grammar");
  const conjMod = lesson.modules.find((m) => m.track === "conjugation");
  const db = await createClient();

  // Contrôle d'accès AVANT toute lecture de contenu : on ne charge même pas le
  // vocabulaire ni la grammaire d'une leçon fermée. Masquer la case dans le plan
  // ne suffirait pas — cette URL peut être tapée directement. La progression est
  // relue en base : le cache du navigateur se modifie en trois secondes.
  const access = await getAccess(db);
  const validated = await getValidatedCodes(db, access.userId);
  const lock = lessonLock(level as JlptLevel, n, getLevelLessons(level as JlptLevel), validated, access);
  if (lock !== null) {
    return (
      <>
        <div className="page-head">
          <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
          <span className="pill-tag">{lesson.level} · Leçon {lesson.num}</span>
          <h1>{lock === "progress" ? "Leçon pas encore ouverte" : "Leçon verrouillée"}</h1>
        </div>
        <div className="locked-card">
          <span className="locked-ic" aria-hidden>{lock === "progress" ? "⏳" : "🔒"}</span>
          {lock === "progress" ? (
            <>
              <p>
                Termine la leçon {n - 1} pour ouvrir celle-ci. Les leçons se suivent, et
                chaque leçon terminée dévoile la suivante.
              </p>
              <Link href={`/lecon/${level}/${n - 1}` as Route} className="btn primary">
                Aller à la leçon {n - 1} →
              </Link>
            </>
          ) : (
            <>
              <p>{LOCKED_MESSAGE}</p>
              <Link href={"/abonnement" as Route} className="btn primary">Voir les offres →</Link>
            </>
          )}
        </div>
      </>
    );
  }

  const [vocab, grammar, conjugation, grammarExercises, conjExercises, comprehension] = await Promise.all([
    vocabMod ? contentService.listVocabByCode(db, vocabMod.lesson.code) : Promise.resolve([]),
    grammarMod ? contentService.getLessonCourse(db, grammarMod.lesson.code) : Promise.resolve([]),
    conjMod ? contentService.getLessonCourse(db, conjMod.lesson.code) : Promise.resolve([]),
    grammarMod ? contentService.getLessonExercises(db, grammarMod.lesson.code) : Promise.resolve([]),
    conjMod ? contentService.getLessonExercises(db, conjMod.lesson.code) : Promise.resolve([]),
    vocabMod ? contentService.getComprehensionByCode(db, vocabMod.lesson.code) : Promise.resolve(null),
  ]);

  return (
    <>
      <div className="page-head">
        <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
        <span className="pill-tag">{lesson.level} · Leçon {lesson.num}</span>
        <h1>{vocabMod?.lesson.title ?? lesson.modules[0]?.lesson.title ?? `Leçon ${lesson.num}`}</h1>
      </div>
      <LessonRoadmap lesson={lesson} vocab={vocab} grammar={grammar} conjugation={conjugation} grammarExercises={grammarExercises} conjExercises={conjExercises} comprehension={comprehension} nextHref={nextHref} />
    </>
  );
}
