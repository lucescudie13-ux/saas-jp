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

export interface LessonRef {
  num: number;
  codes: string[];
}

/** Une leçon est terminée quand toutes ses parties sont validées. Une leçon
 *  sans partie compte comme faite, sinon elle bloquerait la suite à jamais. */
export function isLessonDone(lesson: LessonRef, validated: Set<string>): boolean {
  return lesson.codes.length === 0 || lesson.codes.every((c) => validated.has(c));
}

/**
 * Pourquoi une leçon est fermée, ou `null` si elle est ouverte. Deux causes,
 * volontairement distinguées car elles n'appellent pas la même action :
 *
 *   'subscribe' → hors de l'essai gratuit : il faut s'abonner
 *   'progress'  → à sa portée, mais la leçon précédente n'est pas terminée
 *
 * La progression se calcule niveau par niveau, indépendamment : chaque niveau
 * démarre ouvert à sa leçon 1. Un abonné qui vise le N3 attaque donc le N3
 * directement, sans avoir à traverser le N5.
 */
export type LessonLock = null | "progress" | "subscribe";

export function lessonLock(
  level: JlptLevel,
  num: number,
  lessons: LessonRef[],
  validated: Set<string>,
  access: Access,
): LessonLock {
  if (!canOpenLesson(level, num, access)) return "subscribe";
  if (num <= 1) return null; // point de départ de chaque niveau
  const previous = lessons.find((l) => l.num === num - 1);
  if (!previous) return null;
  return isLessonDone(previous, validated) ? null : "progress";
}

/**
 * Leçons dont le CONTENU est dévoilé dans les listes (vocabulaire, grammaire,
 * conjugaison) — même mécanique que `lessonLock`, exprimée en ensemble pour
 * parcourir une liste d'un coup.
 *
 * À appeler côté SERVEUR : le contenu des leçons non dévoilées ne doit pas
 * partir dans la page, sinon il suffit d'ouvrir l'inspecteur pour tout lire.
 */
export function revealedLessonNumbers(
  level: JlptLevel,
  lessons: LessonRef[],
  validated: Set<string>,
  access: Access,
): Set<number> {
  const revealed = new Set<number>();
  for (const lesson of lessons) {
    if (lessonLock(level, lesson.num, lessons, validated, access) !== null) break;
    revealed.add(lesson.num);
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
