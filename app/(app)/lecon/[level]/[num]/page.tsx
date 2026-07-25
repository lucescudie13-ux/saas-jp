import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import { getCombinedLesson } from "@/lib/curriculum";
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
      <LessonRoadmap lesson={lesson} vocab={vocab} grammar={grammar} conjugation={conjugation} grammarExercises={grammarExercises} conjExercises={conjExercises} comprehension={comprehension} />
    </>
  );
}
