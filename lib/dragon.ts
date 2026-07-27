// lib/dragon.ts — Modèle de gamification « Dragon ».
//
// Le dragon évolue avec l'apprentissage : chaque PARTIE terminée rapporte de
// l'expérience (XP). L'XP détermine à la fois un NIVEAU (la barre de
// progression « EXP x / y ») et un STADE d'évolution (l'apparence du dragon :
// œuf → … → légendaire).
//
// Barème :
//   • une LEÇON entière vaut 100 XP → la terminer fait monter d'un niveau pile
//   • ces 100 XP sont partagés entre ses parties : vocabulaire + grammaire +
//     conjugaison → 33 / 33 / 34 ; vocabulaire + grammaire → 50 / 50 ; etc.
//   • une partie ne se valide qu'en faisant ses exercices (cf. LessonRoadmap)
//
// La progression est dérivée DIRECTEMENT des parties validées
// (lib/lesson-progress) : rien de plus à stocker. Terminer une partie fait
// monter le dragon, l'annuler le fait redescendre — tout reste cohérent.

import { JLPT_LEVELS } from "./constants";
import { getLevelLessons } from "./curriculum";

/** XP d'une leçon complète. */
export const XP_PER_LESSON = 100;

/** XP nécessaire pour passer un niveau — soit exactement une leçon. */
export const XP_PER_LEVEL = 100;

export interface DragonStage {
  key: string;
  name: string;
  /** Illustration du stade (public/dragons/<key>.png). Repli sur l'emoji si absente. */
  img: string;
  /** Emoji de secours tant que l'illustration n'est pas fournie. */
  emoji: string;
  /** Courte description affichée sous le nom (cf. maquette). */
  tagline: string;
  /** XP minimale requise pour atteindre ce stade. */
  minXp: number;
  /** Couleur d'accent de l'aura du dragon à ce stade. */
  color: string;
}

/** Les 6 stades d'évolution, du plus faible au plus puissant.
 * Les illustrations définitives vont dans public/dragons/ (voir le README). */
// Une leçon = 100 XP = 1 niveau → les seuils se lisent en leçons :
// 3, 15, 40, 90 et 180 leçons (cf. public/dragons/README.md).
export const DRAGON_STAGES: DragonStage[] = [
  { key: "egg",        name: "Œuf",        img: "/dragons/egg.svg",        emoji: "🥚", tagline: "Nouveau départ",   minXp: 0,     color: "#B0843A" },
  { key: "hatchling",  name: "Éclosion",   img: "/dragons/hatchling.svg",  emoji: "🐣", tagline: "Premiers mots",    minXp: 300,   color: "#C99A46" },
  { key: "apprentice", name: "Apprenti",   img: "/dragons/apprentice.svg", emoji: "🦎", tagline: "Phrases simples",  minXp: 1500,  color: "#6E8B5B" },
  { key: "adventurer", name: "Aventurier", img: "/dragons/adventurer.svg", emoji: "🐲", tagline: "Conversations",    minXp: 4000,  color: "#3E7CA6" },
  { key: "master",     name: "Maître",     img: "/dragons/master.svg",     emoji: "🐉", tagline: "Maîtrise avancée", minXp: 9000,  color: "#8A5BB0" },
  { key: "legendary",  name: "Légendaire", img: "/dragons/legendary.svg",  emoji: "🐉", tagline: "Niveau expert",    minXp: 18000, color: "#C2402F" },
];

/**
 * XP de chaque partie, code par code. Les 100 XP d'une leçon sont répartis
 * entre ses parties ; le reste de la division va à la dernière pour que le
 * total d'une leçon fasse exactement 100 (3 parties → 33 / 33 / 34).
 * Construit une seule fois, à la première demande.
 */
let xpByCode: Map<string, number> | null = null;

export function getXpByCode(): Map<string, number> {
  if (xpByCode) return xpByCode;
  const map = new Map<string, number>();
  for (const level of JLPT_LEVELS) {
    for (const lesson of getLevelLessons(level)) {
      const n = lesson.codes.length;
      if (n === 0) continue;
      const share = Math.floor(XP_PER_LESSON / n);
      lesson.codes.forEach((code, i) => {
        // La dernière partie absorbe le reste (33 + 33 + 34 = 100).
        map.set(code, i === n - 1 ? XP_PER_LESSON - share * (n - 1) : share);
      });
    }
  }
  xpByCode = map;
  return map;
}

/** XP d'une partie précise (0 si le code est inconnu du curriculum). */
export function xpForCode(code: string): number {
  return getXpByCode().get(code) ?? 0;
}

/** XP totale gagnée d'après les parties validées. */
export function xpFromValidated(validated: Set<string>): number {
  const map = getXpByCode();
  let xp = 0;
  for (const code of validated) xp += map.get(code) ?? 0;
  return xp;
}

export interface DragonState {
  xp: number;
  /** Niveau courant (≥ 1). */
  level: number;
  stage: DragonStage;
  stageIndex: number;
  nextStage: DragonStage | null;
  /** XP accumulée à l'intérieur du niveau courant. */
  xpIntoLevel: number;
  /** XP totale que représente le niveau courant (largeur de la barre). */
  xpForLevel: number;
  /** XP restante avant le niveau suivant. */
  xpToNextLevel: number;
  /** Avancement dans le niveau courant, 0–100. */
  levelPct: number;
  /** Avancement vers le stade d'évolution suivant, 0–100. */
  stagePct: number;
  /** XP restante avant le prochain stade (0 si déjà légendaire). */
  xpToNextStage: number;
}

/** Calcule l'état complet du dragon à partir de l'XP gagnée. */
export function computeDragon(xp: number): DragonState {
  // — Niveau : marche fixe de 100 XP, soit une leçon entière.
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpForLevel = XP_PER_LEVEL;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const levelPct = Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100));

  // — Stade d'évolution : dernier stade dont le seuil est atteint.
  let stageIndex = 0;
  for (let i = 0; i < DRAGON_STAGES.length; i++) {
    if (xp >= DRAGON_STAGES[i]!.minXp) stageIndex = i;
  }
  const stage = DRAGON_STAGES[stageIndex]!;
  const nextStage = DRAGON_STAGES[stageIndex + 1] ?? null;
  const stagePct = nextStage
    ? Math.min(100, Math.round(((xp - stage.minXp) / (nextStage.minXp - stage.minXp)) * 100))
    : 100;
  const xpToNextStage = nextStage ? Math.max(0, nextStage.minXp - xp) : 0;

  return {
    xp,
    level,
    stage,
    stageIndex,
    nextStage,
    xpIntoLevel,
    xpForLevel,
    xpToNextLevel: xpForLevel - xpIntoLevel,
    levelPct,
    stagePct,
    xpToNextStage,
  };
}
