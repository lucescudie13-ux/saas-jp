import Link from "next/link";
import type { Route } from "next";
import { PlanCurriculum } from "@/components/features/PlanCurriculum";

export default function PlanPage() {
  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Du N5 au N1</h1>
        <p>
          Chaque niveau est découpé en leçons de vocabulaire, de grammaire et de conjugaison. Choisis une leçon,
          fais-la, valide-la — sa case devient verte.
        </p>
      </div>

      <Link href={"/plan/modele" as Route} className="lesson-cta plan-model-link">
        <div className="lesson-cta-text">
          <h3>À quoi ressemble une leçon ?</h3>
          <p>Découvre la structure type d&apos;une leçon — apprentissage puis exercices.</p>
        </div>
        <span className="btn primary lesson-cta-btn">Voir le modèle →</span>
      </Link>

      <PlanCurriculum />
    </>
  );
}
