import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getVracLesson } from "@/lib/vrac";
import { LessonExercise } from "@/components/features/LessonExercise";

export default async function VracExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getVracLesson(slug);
  if (!lesson || !lesson.exercise) notFound();

  return (
    <>
      <div className="page-head">
        <Link href={`/vrac/${lesson.slug}` as Route} className="vrac-back">← {lesson.title}</Link>
        <span className="pill-tag">Exercice</span>
        <h1>Exercice — {lesson.title}</h1>
        <p>Mets en pratique la leçon dans les deux sens : japonais → français, puis français → japonais. Traduis chaque phrase, compare avec le modèle, puis auto-évalue-toi.</p>
      </div>
      <LessonExercise items={lesson.exercise.items} />
    </>
  );
}
