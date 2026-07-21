import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import { getCombinedLesson } from "@/lib/curriculum";
import { getGrammarRules } from "@/lib/grammar-content";
import { getConjugationRules } from "@/lib/conjugation-content";
import { getGrammarExercises, getConjExercises } from "@/lib/exercise-content";
import { getComprehension } from "@/lib/comprehension-content";
import { LessonRoadmap } from "@/components/features/LessonRoadmap";
import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";

export default async function LeconPage({ params }: { params: Promise<{ level: string; num: string }> }) {
  const { level, num } = await params;
  if (!JLPT_LEVELS.includes(level as JlptLevel)) notFound();
  const n = Number(num);
  if (!Number.isInteger(n)) notFound();
  const lesson = getCombinedLesson(level as JlptLevel, n);
  if (!lesson) notFound();

  const vocabMod = lesson.modules.find((m) => m.track === "vocab");
  const grammarMod = lesson.modules.find((m) => m.track === "grammar");
  const conjMod = lesson.modules.find((m) => m.track === "conjugation");
  const db = await createClient();
  const vocab = vocabMod ? await contentService.listVocabByCode(db, vocabMod.lesson.code) : [];
  const grammar = grammarMod ? getGrammarRules(lesson.level, grammarMod.lesson.code) : [];
  const conjugation = conjMod ? getConjugationRules(lesson.level, conjMod.lesson.code) : [];
  const grammarExercises = grammarMod ? getGrammarExercises(lesson.level, grammarMod.lesson.code) : [];
  const conjExercises = conjMod ? getConjExercises(lesson.level, conjMod.lesson.code) : [];
  const comprehension = vocabMod ? getComprehension(lesson.level, vocabMod.lesson.code) : null;

  return (
    <>
      <div className="page-head">
        <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
        <span className="pill-tag">{lesson.level} · Leçon {lesson.num}</span>
        <h1>Leçon {lesson.num}</h1>
        <p>
          {lesson.modules.length} module{lesson.modules.length > 1 ? "s" : ""} d&apos;apprentissage, puis les exercices.
          Valide chaque module : la leçon devient verte quand tout est validé.
        </p>
      </div>
      <LessonRoadmap lesson={lesson} vocab={vocab} grammar={grammar} conjugation={conjugation} grammarExercises={grammarExercises} conjExercises={conjExercises} comprehension={comprehension} />
    </>
  );
}
