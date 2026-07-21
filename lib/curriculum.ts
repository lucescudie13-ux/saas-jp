// lib/curriculum.ts — Plan maître JLPT (N5 → N1).
// Squelette des leçons : chaque leçon a un code, un titre et un nombre de
// règles/mots. Le contenu détaillé (règles, mots, exercices) sera ajouté ensuite.
// Trois pistes par niveau : grammaire, conjugaison, vocabulaire.

import type { JlptLevel } from "@/lib/constants";
import { N4 } from "./curriculum-n4";
import { N3 } from "./curriculum-n3";
import { N2 } from "./curriculum-n2";
import { N1 } from "./curriculum-n1";

export type Track = "grammar" | "conjugation" | "vocab";

export const TRACK_LABELS: Record<Track, string> = {
  grammar: "Grammaire",
  conjugation: "Conjugaison",
  vocab: "Vocabulaire",
};
export const TRACK_ICONS: Record<Track, string> = {
  grammar: "🧩",
  conjugation: "🔄",
  vocab: "🧠",
};
export const TRACK_ORDER: Track[] = ["vocab", "grammar", "conjugation"];

/** Une leçon du plan (squelette). `count` = nombre de règles (grammaire /
 * conjugaison) ou de mots (vocabulaire). */
export interface PlanLesson {
  code: string;
  title: string;
  count: number;
}
export interface LevelCurriculum {
  grammar: PlanLesson[];
  conjugation: PlanLesson[];
  vocab: PlanLesson[];
}

const N5: LevelCurriculum = {
  grammar: [
    { code: "N5-01", title: "La copule : présent, négation et passé", count: 4 },
    { code: "N5-02", title: "Les adjectifs en い et en な : épithète et prédicat", count: 4 },
    { code: "N5-03", title: "Relier et transformer les adjectifs", count: 2 },
    { code: "N5-04", title: "Le thème et le sujet : は et が", count: 2 },
    { code: "N5-05", title: "L'objet et la direction : を, に et へ", count: 2 },
    { code: "N5-06", title: "Les fonctions de la particule で", count: 1 },
    { code: "N5-07", title: "La particule に : existence et moment précis", count: 2 },
    { code: "N5-08", title: "Les bornes avec から et まで", count: 2 },
    { code: "N5-09", title: "La particule と : accompagnement et liste exhaustive", count: 2 },
    { code: "N5-10", title: "L'énumération ouverte avec や et など", count: 1 },
    { code: "N5-11", title: "La relation nominale avec の", count: 1 },
    { code: "N5-12", title: "Addition et alternative : も et か", count: 2 },
    { code: "N5-13", title: "Les particules finales : か, ね, よ et なあ", count: 4 },
    { code: "N5-14", title: "Le système こ・そ・あ・ど", count: 4 },
    { code: "N5-15", title: "Les interrogatifs indéfinis avec か et も", count: 2 },
    { code: "N5-16", title: "ある et いる : existence, localisation et possession", count: 4 },
    { code: "N5-17", title: "Désir, goût et aptitude avec le sujet en が", count: 2 },
    { code: "N5-18", title: "Déterminer ou remplacer un nom avec une proposition et の", count: 2 },
    { code: "N5-19", title: "Nominaliser une action avec の, のは et のが", count: 2 },
    { code: "N5-20", title: "La valeur explicative de の et ん", count: 2 },
    { code: "N5-21", title: "La limitation avec だけ", count: 1 },
    { code: "N5-22", title: "L'approximation avec くらい／ぐらい et ごろ", count: 2 },
    { code: "N5-23", title: "Comparatif, préférence, superlatif et question comparative", count: 4 },
    { code: "N5-24", title: "Exprimer une fréquence ou une distribution", count: 1 },
    { code: "N5-25", title: "Situer une action avant ou après une autre", count: 2 },
    { code: "N5-26", title: "Exprimer la cause avec から", count: 1 },
    { code: "N5-27", title: "Opposition, atténuation et contraste", count: 2 },
    { code: "N5-28", title: "Probabilité et confirmation avec でしょう et だろう", count: 2 },
    { code: "N5-29", title: "Décider un changement ou constater une évolution : する et なる", count: 2 },
    { code: "N5-30", title: "Exprimer une intention planifiée avec つもり", count: 1 },
  ],
  conjugation: [
    { code: "F1-N5-01", title: "Construire la forme connective selon le groupe", count: 5 },
    { code: "F1-N5-02", title: "Former tout le paradigme négatif neutre", count: 4 },
    { code: "F2-N5-01", title: "Construire la forme nominalisée selon le groupe", count: 4 },
    { code: "F2-N5-02", title: "Maîtriser le paradigme complet en ます", count: 4 },
    { code: "F2-N5-03", title: "Former l'invitation et le volitif polis", count: 2 },
    { code: "F2-N5-04", title: "Conjuguer l'auxiliaire de désir たい", count: 4 },
    { code: "F2-N5-05", title: "Employer la base en I comme nom d'action", count: 1 },
    { code: "F3-N5-01", title: "Construire la forme suspensive du groupe 1", count: 6 },
    { code: "F3-N5-02", title: "Construire la forme suspensive des groupes 2 et 3", count: 2 },
    { code: "F3-N5-03", title: "Dériver le passé de la forme suspensive", count: 2 },
    { code: "F3-N5-04", title: "Exprimer une action en cours ou un état résultant", count: 1 },
    { code: "F3-N5-05", title: "Former une demande polie", count: 1 },
    { code: "F3-N5-06", title: "Former les deux modalités de base", count: 2 },
    { code: "HC-N5-01", title: "Identifier le non-passé neutre affirmatif", count: 1 },
  ],
  vocab: [
    { code: "V-N5-01", title: "Expressions, politesse et communication", count: 33 },
    { code: "V-N5-02", title: "Nombres, compteurs, mesures et quantités — 1/2", count: 23 },
    { code: "V-N5-03", title: "Nombres, compteurs, mesures et quantités — 2/2", count: 22 },
    { code: "V-N5-04", title: "Temps, calendrier et fréquence — 1/2", count: 34 },
    { code: "V-N5-05", title: "Temps, calendrier et fréquence — 2/2", count: 34 },
    { code: "V-N5-06", title: "Personnes, famille et relations", count: 34 },
    { code: "V-N5-07", title: "Corps, santé et soins", count: 23 },
    { code: "V-N5-08", title: "Maison, objets et vie quotidienne", count: 31 },
    { code: "V-N5-09", title: "Alimentation, cuisine et restauration", count: 36 },
    { code: "V-N5-10", title: "Vêtements, apparence et couleurs", count: 26 },
    { code: "V-N5-11", title: "École, études et langue", count: 33 },
    { code: "V-N5-12", title: "Travail, commerce, argent et économie", count: 12 },
    { code: "V-N5-13", title: "Lieux, ville et services", count: 20 },
    { code: "V-N5-14", title: "Transport, voyage et orientation", count: 25 },
    { code: "V-N5-15", title: "Nature, météo, animaux et plantes", count: 21 },
    { code: "V-N5-16", title: "Culture, loisirs et sport", count: 13 },
    { code: "V-N5-17", title: "Émotions, pensée et relations sociales", count: 21 },
    { code: "V-N5-18", title: "Mouvement, position et actions physiques", count: 29 },
    { code: "V-N5-19", title: "États, changements et propriétés", count: 14 },
    { code: "V-N5-20", title: "Adverbes, connecteurs, mots-outils et nuances — 1/2", count: 23 },
    { code: "V-N5-21", title: "Adverbes, connecteurs, mots-outils et nuances — 2/2", count: 23 },
    { code: "V-N5-22", title: "Verbes généraux", count: 34 },
    { code: "V-N5-23", title: "Adjectifs et descriptions — 1/2", count: 30 },
    { code: "V-N5-24", title: "Adjectifs et descriptions — 2/2", count: 29 },
    { code: "V-N5-25", title: "Noms et notions générales — 1/4", count: 27 },
    { code: "V-N5-26", title: "Noms et notions générales — 2/4", count: 26 },
    { code: "V-N5-27", title: "Noms et notions générales — 3/4", count: 26 },
    { code: "V-N5-28", title: "Noms et notions générales — 4/4", count: 26 },
  ],
};

/** Niveaux disponibles dans le plan. */
export const CURRICULUM: Partial<Record<JlptLevel, LevelCurriculum>> = {
  N5,
  N4,
  N3,
  N2,
  N1,
};

/**
 * Une leçon combinée : à l'index i, elle réunit la i-ème leçon de vocabulaire,
 * de grammaire et de conjugaison (celles qui existent). Le nombre total de
 * leçons d'un niveau est le plus grand des trois effectifs — les modules
 * manquants sont simplement absents des dernières leçons.
 */
export interface CombinedModule {
  track: Track;
  lesson: PlanLesson;
}
export interface CombinedLesson {
  level: JlptLevel;
  num: number; // 1-based
  modules: CombinedModule[];
  codes: string[]; // codes des modules présents
}

export function getLevelLessons(level: JlptLevel): CombinedLesson[] {
  const cur = CURRICULUM[level];
  if (!cur) return [];
  const total = Math.max(cur.vocab.length, cur.grammar.length, cur.conjugation.length);
  const lessons: CombinedLesson[] = [];
  for (let i = 0; i < total; i++) {
    const modules: CombinedModule[] = [];
    for (const track of TRACK_ORDER) {
      const l = cur[track][i];
      if (l) modules.push({ track, lesson: l });
    }
    lessons.push({ level, num: i + 1, modules, codes: modules.map((m) => m.lesson.code) });
  }
  return lessons;
}

export function getCombinedLesson(level: JlptLevel, num: number): CombinedLesson | undefined {
  return getLevelLessons(level)[num - 1];
}

/** Nombre total de leçons combinées d'un niveau (0 si niveau non chargé). */
export function levelLessonCount(level: JlptLevel): number {
  const cur = CURRICULUM[level];
  if (!cur) return 0;
  return Math.max(cur.vocab.length, cur.grammar.length, cur.conjugation.length);
}
