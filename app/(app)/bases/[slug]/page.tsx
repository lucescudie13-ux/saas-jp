import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getFoundationLesson, foundationLessons, FOUNDATIONS_LABEL } from "@/lib/foundations";
import { CourseSections } from "@/components/features/CourseSections";

/**
 * Une leçon préliminaire (« Les bases »). Le contenu vient du groupe
 * « fondamentaux » de lib/vrac.ts ; cette page ne fait que le présenter sous
 * l'identité de la catégorie, avec un enchaînement vers la suivante.
 */
export default async function BasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getFoundationLesson(slug);
  if (!lesson) notFound();

  const all = foundationLessons();
  const index = all.findIndex((l) => l.slug === slug);
  const next = index >= 0 ? all[index + 1] : undefined;

  return (
    <>
      <div className="page-head">
        <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
        <span className="pill-tag">{FOUNDATIONS_LABEL}</span>
        <h1>{lesson.title}</h1>
        {lesson.summary && <p>{lesson.summary}</p>}
      </div>

      {lesson.sections && lesson.sections.length > 0 ? (
        <CourseSections sections={lesson.sections} />
      ) : (
        <p className="empty">Contenu à venir.</p>
      )}

      {next && (
        <section className="lesson-cta">
          <div className="lesson-cta-text">
            <h3>Sujet suivant</h3>
            <p>{next.title}</p>
          </div>
          <Link className="btn primary lesson-cta-btn" href={`/bases/${next.slug}` as Route}>
            Continuer →
          </Link>
        </section>
      )}
    </>
  );
}
