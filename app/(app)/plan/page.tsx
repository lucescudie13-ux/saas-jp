import { LessonPath } from "@/components/features/LessonPath";

export default async function PlanPage() {
  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Ton parcours</h1>
        <p>
          Progresse niveau par niveau, du N5 au N1. Tous les niveaux sont ouverts : choisis
          ta leçon et avance à ton rythme, jusqu&apos;au boss qui valide chaque niveau.
        </p>
      </div>

      <LessonPath />
    </>
  );
}
