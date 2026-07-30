// lib/foundations.ts — La catégorie préliminaire, avant le N5.
//
// « Comprendre comment le japonais fonctionne, et comment l'apprendre » : ce
// qu'on gagne à savoir AVANT d'attaquer le vocabulaire et la grammaire. C'est
// la première chose que voit un nouvel inscrit sur son plan d'étude.
//
// Le contenu n'est pas dupliqué : il vit dans le groupe « fondamentaux » de
// lib/vrac.ts, où il a été rédigé. Ce fichier ne fait que l'exposer sous une
// identité propre et lui donner une place dans le parcours.

import { VRAC_GROUPS, type VracLesson } from "./vrac";

/** Étiquette courte, à la place du badge de niveau (N5, N4…). */
export const FOUNDATIONS_BADGE = "★";

/** Nom de la catégorie dans le plan. */
export const FOUNDATIONS_LABEL = "Les bases";

/** Sous-titre : ce que couvre la catégorie. */
export const FOUNDATIONS_TITLE =
  "Fonctionnement du japonais et méthode de travail";

export const FOUNDATIONS_INTRO =
  "Avant le vocabulaire et la grammaire : comment la langue est construite, " +
  "et comment l'apprendre sans perdre de temps.";

/** Les leçons préliminaires, dans l'ordre de lecture. */
export function foundationLessons(): VracLesson[] {
  return VRAC_GROUPS.find((g) => g.id === "fondamentaux")?.lessons ?? [];
}

export function getFoundationLesson(slug: string): VracLesson | undefined {
  return foundationLessons().find((l) => l.slug === slug);
}

/**
 * Ces leçons sont ouvertes à TOUT LE MONDE, y compris sans abonnement : c'est
 * de la méthode, pas du contenu à protéger, et c'est ce qui donne envie de
 * continuer. Elles ne portent donc pas de verrou.
 */
export const FOUNDATIONS_ARE_FREE = true;
