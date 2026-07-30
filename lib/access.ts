// lib/access.ts — Qui a le droit d'ouvrir quoi.
//
// TOUTE la politique d'accès au contenu tient dans ce fichier, et une seule
// fonction décide : `canOpenLesson`. Changer le modèle commercial (essai plus
// large, déblocage progressif, accès par niveau…) se fait ici, sans toucher
// aux pages ni aux composants.
//
// Règles actuelles :
//   • administrateur → tout, sans abonnement
//   • abonné actif   → tout
//   • visiteur       → les FREE_LESSON_COUNT premières leçons du FREE_LEVEL
//
// RAPPEL IMPORTANT : cacher un bouton ne protège rien. Toute page qui sert du
// contenu de leçon doit appeler `canOpenLesson` côté SERVEUR et refuser l'accès,
// sinon il suffit de taper l'URL à la main.

import { type JlptLevel } from "./constants";

/** Niveau dont les premières leçons sont offertes. */
export const FREE_LEVEL: JlptLevel = "N5";

/** Nombre de leçons offertes, au début de FREE_LEVEL. */
export const FREE_LESSON_COUNT = 5;

export interface Access {
  /** Compte administrateur (profiles.role = 'admin'). */
  isAdmin: boolean;
  /** Abonnement actif (mensuel ou accès à vie). */
  isPro: boolean;
}

/** Accès complet au contenu, quelle que soit la leçon. */
export function hasFullAccess(access: Access): boolean {
  return access.isAdmin || access.isPro;
}

/** Cette leçon est-elle ouverte pour cet utilisateur ? */
export function canOpenLesson(level: JlptLevel, num: number, access: Access): boolean {
  if (hasFullAccess(access)) return true;
  return level === FREE_LEVEL && num >= 1 && num <= FREE_LESSON_COUNT;
}

/** L'examen d'un niveau suit la même règle que ses leçons. */
export function canOpenExam(level: JlptLevel, access: Access): boolean {
  return hasFullAccess(access) || level === FREE_LEVEL;
}

/**
 * Leçons dont le CONTENU est dévoilé dans les listes (vocabulaire, grammaire,
 * conjugaison) — mécanique de récompense : terminer une leçon fait apparaître
 * le contenu de la suivante. On ne voit donc jamais plus d'une leçon d'avance.
 *
 * Cumulé avec les droits d'accès : un visiteur gratuit plafonne aux leçons
 * offertes même s'il les termine toutes.
 *
 * À appeler côté SERVEUR : le contenu des leçons non dévoilées ne doit pas
 * partir dans la page, sinon il suffit d'ouvrir l'inspecteur pour tout lire.
 */
export function revealedLessonNumbers(
  level: JlptLevel,
  lessons: Array<{ num: number; codes: string[] }>,
  validated: Set<string>,
  access: Access,
): Set<number> {
  const revealed = new Set<number>();
  // La première leçon est toujours offerte : il faut bien un point de départ.
  let previousDone = true;
  for (const lesson of lessons) {
    if (!previousDone) break;
    if (!canOpenLesson(level, lesson.num, access)) break;
    revealed.add(lesson.num);
    previousDone = lesson.codes.length > 0 && lesson.codes.every((c) => validated.has(c));
  }
  return revealed;
}

/** Un élément de liste rattaché à sa leçon. Verrouillé, `items` est vide :
 *  seuls le numéro, le titre et le nombre d'éléments sont transmis. */
export interface GatedGroup<T> {
  num: number;
  title: string;
  /** Nombre d'éléments annoncé (connu même verrouillé, via le curriculum). */
  count: number;
  revealed: boolean;
  items: T[];
  /** Pourquoi c'est fermé — les deux cas n'appellent pas la même action :
   *  'progress' → finir la leçon précédente ; 'subscribe' → s'abonner. */
  lockReason?: "progress" | "subscribe";
}

/** Phrase affichée sur un contenu verrouillé. */
export const LOCKED_MESSAGE =
  `L'essai gratuit couvre les ${FREE_LESSON_COUNT} premières leçons du ${FREE_LEVEL}. ` +
  `Abonne-toi pour ouvrir tout le parcours, du N5 au N1.`;
