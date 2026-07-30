import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { getVracLesson } from "@/lib/vrac";
import { requireAdmin } from "@/server/access/admin-only";
import { CourseSections } from "@/components/features/CourseSections";
import { VocabFiche } from "@/components/features/VocabFiche";

export default async function VracLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const lesson = getVracLesson(slug);
  if (!lesson) notFound();
  const audio = lesson.audio?.trim();

  return (
    <>
      <div className="page-head">
        <Link href={"/vrac" as Route} className="vrac-back">← Vrac</Link>
        <span className="pill-tag">Vrac</span>
        <h1>{lesson.title}</h1>
        {lesson.summary && <p>{lesson.summary}</p>}
      </div>

      {/* ----- Audio de la leçon (si la leçon en définit un) ----- */}
      {lesson.audio !== undefined && (
      <section className="course-audio">
        <div className="audio-card">
          <div className="audio-glyph" aria-hidden>🎧</div>
          <div className="audio-main">
            <div className="audio-title">Écoute de la leçon</div>
            {audio ? (
              <audio className="audio-el" controls preload="none" src={audio}>
                Votre navigateur ne prend pas en charge la lecture audio.
              </audio>
            ) : (
              <>
                <div className="audio-wave" aria-hidden>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i} style={{ height: `${18 + ((i * 7) % 26)}px` }} />
                  ))}
                </div>
                <div className="audio-hint">
                  Audio à ajouter — renseigne le champ <code>audio</code> de la leçon dans <code>lib/vrac.ts</code>.
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ----- Fiche de vocabulaire (si la leçon en définit une) ----- */}
      {lesson.vocabFiche && (
        <article className="course-body">
          <VocabFiche item={lesson.vocabFiche} />
        </article>
      )}

      {/* ----- Texte du cours ----- */}
      {lesson.sections && lesson.sections.length > 0 && (
        <CourseSections sections={lesson.sections} />
      )}

      {/* ----- Accès à l'exercice de fin de leçon ----- */}
      {lesson.exercise && (
        <section className="lesson-cta">
          <div className="lesson-cta-text">
            <h3>Prêt·e à t&apos;entraîner ?</h3>
            <p>{lesson.exercise.items.length} questions japonais → français et {lesson.exercise.items.length} français → japonais pour mettre en pratique cette leçon.</p>
          </div>
          <Link className="btn primary lesson-cta-btn" href={`/vrac/${lesson.slug}/exercice` as Route}>
            Passer à l&apos;exercice →
          </Link>
        </section>
      )}
    </>
  );
}
