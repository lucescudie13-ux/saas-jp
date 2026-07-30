import { createClient } from "@/lib/supabase/server";
import { getAccess } from "@/server/access/access.service";
import { hasFullAccess, FREE_LEVEL, FREE_LESSON_COUNT } from "@/lib/access";
import { LessonPath } from "@/components/features/LessonPath";

export default async function PlanPage() {
  const access = await getAccess(await createClient());
  const full = hasFullAccess(access);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Ton parcours</h1>
        <p>
          {full
            ? "Progresse niveau par niveau, du N5 au N1. Tous les niveaux sont ouverts : choisis ta leçon et avance à ton rythme, jusqu'au boss qui valide chaque niveau."
            : `Les ${FREE_LESSON_COUNT} premières leçons du ${FREE_LEVEL} sont offertes. Le reste du parcours, jusqu'au N1, s'ouvre avec l'abonnement.`}
        </p>
      </div>

      <LessonPath fullAccess={full} />
    </>
  );
}
