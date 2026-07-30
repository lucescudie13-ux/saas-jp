"use client";

import type { Route } from "next";
import Link from "next/link";

/**
 * Bloc d'une leçon non encore dévoilée : on montre qu'il y a bien du contenu
 * (numéro de leçon, titre, nombre d'éléments) sans en livrer une ligne. Les
 * lignes sont des barres factices — le vrai contenu n'est même pas envoyé par
 * le serveur, donc rien à récupérer dans le code source de la page.
 *
 * `reason` distingue les deux causes de verrouillage, qui n'appellent pas la
 * même action : terminer la leçon précédente, ou s'abonner.
 */
export function LockedLessonRows({
  num,
  title,
  count,
  unit,
  reason,
}: {
  num: number;
  title: string;
  count: number;
  unit: string;
  reason: "progress" | "subscribe";
}) {
  // Trois barres suffisent à évoquer une liste sans l'imiter lourdement.
  const bars = Math.min(3, Math.max(1, count));

  return (
    <section className="locked-lesson">
      <header className="locked-lesson-head">
        <span className="locked-lesson-num">Leçon {num}</span>
        <span className="locked-lesson-title">{title}</span>
        <span className="locked-lesson-count">
          {count} {unit}
          {count > 1 ? "s" : ""}
        </span>
        <span className="locked-lesson-ic" aria-hidden>🔒</span>
      </header>

      <ul className="locked-lesson-bars" aria-hidden>
        {Array.from({ length: bars }, (_, i) => (
          <li key={i}>
            <i style={{ width: `${[34, 52, 42][i] ?? 40}%` }} />
            <i style={{ width: `${[22, 16, 26][i] ?? 20}%` }} />
          </li>
        ))}
      </ul>

      <p className="locked-lesson-why">
        {reason === "progress" ? (
          <>Termine la leçon précédente pour débloquer ce contenu.</>
        ) : (
          <>
            Contenu réservé aux abonnés.{" "}
            <Link href={"/abonnement" as Route}>Voir les offres →</Link>
          </>
        )}
      </p>
    </section>
  );
}
