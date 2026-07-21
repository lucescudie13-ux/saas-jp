import Link from "next/link";
import type { Route } from "next";
import { PlanCurriculum } from "@/components/features/PlanCurriculum";
import { VRAC_GROUPS } from "@/lib/vrac";

// Plan 1 — « Comprendre le japonais » : la façon classique de commencer,
// reprend les leçons « Fonctionnement du japonais » du Vrac (écriture,
// prononciation, grammaire, conjugaison).
const FOUNDATIONS =
  VRAC_GROUPS.find((g) => g.title === "Fonctionnement du japonais")?.lessons ?? [];

export default function PlanPage() {
  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Ton parcours</h1>
        <p>
          Deux plans qui se complètent : commence par comprendre comment fonctionne le japonais,
          puis progresse niveau par niveau, du N5 au N1.
        </p>
      </div>

      {/* ---- Plan 1 : les fondamentaux ---- */}
      {FOUNDATIONS.length > 0 && (
        <section className="plan-section">
          <div className="plan-section-head">
            <span className="plan-section-eyebrow">Plan 1 · Pour bien démarrer</span>
            <h2 className="plan-section-title">Comprendre le japonais</h2>
            <p className="plan-section-sub">
              Avant les niveaux : comment marchent l&apos;écriture, la prononciation, la grammaire et
              la conjugaison. À lire dans l&apos;ordre.
            </p>
          </div>
          <ol className="founda-list">
            {FOUNDATIONS.map((l, i) => (
              <li key={l.slug}>
                <Link href={`/vrac/${l.slug}` as Route} className="block founda-card">
                  <span className="founda-num">{i + 1}</span>
                  <span className="founda-body">
                    <span className="founda-title">{l.title}</span>
                    {l.summary && <span className="founda-sum">{l.summary}</span>}
                  </span>
                  <span className="founda-ar" aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---- Plan 2 : parcours JLPT ---- */}
      <section className="plan-section">
        <div className="plan-section-head">
          <span className="plan-section-eyebrow">Plan 2 · Progression complète</span>
          <h2 className="plan-section-title">Parcours JLPT — du N5 au N1</h2>
          <p className="plan-section-sub">
            Chaque niveau est découpé en leçons de vocabulaire, de grammaire et de conjugaison.
            Choisis une leçon, fais-la, valide-la — sa case devient verte.
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
      </section>
    </>
  );
}
