import { LessonPath } from "@/components/features/LessonPath";

export default function PlanPage() {
  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Ton parcours</h1>
        <p>
          Progresse niveau par niveau, du N5 au N1. Suis la route, leçon après leçon,
          jusqu&apos;au boss qui valide chaque niveau.
        </p>
      </div>

      <LessonPath />
    </>
  );
}
