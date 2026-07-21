import Link from "next/link";
import type { Route } from "next";
import { LessonModel } from "@/components/features/LessonModel";

export default function LessonModelPage() {
  return (
    <>
      <div className="page-head">
        <Link href={"/plan" as Route} className="vrac-back">← Plan d&apos;étude</Link>
        <span className="pill-tag">Modèle de leçon</span>
        <h1>Structure d&apos;une leçon</h1>
        <p>
          La feuille de route d&apos;une leçon type — identique à chaque niveau (N5 → N1), seul le contenu change.
          Fais les modules dans l&apos;ordre que tu veux et valide-les au fur et à mesure.
        </p>
      </div>
      <LessonModel />
    </>
  );
}
