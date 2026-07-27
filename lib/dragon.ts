// lib/dragon.ts — Modèle de gamification « Dragon ».
//
// Le dragon évolue avec l'apprentissage : chaque PARTIE terminée rapporte de
// l'expérience (XP). L'XP détermine à la fois un NIVEAU (la barre de
// progression « EXP x / y ») et un STADE d'évolution (l'apparence du dragon :
// œuf → … → légendaire).
//
// Barème :
//   • 10 XP par partie de leçon terminée (vocabulaire, grammaire, conjugaison)
//   • 10 XP par session d'exercices terminée
//   • 100 XP pour passer un niveau → 10 parties par niveau
//
// La progression est dérivée DIRECTEMENT des parties validées
// (lib/lesson-progress) : rien de plus à stocker. Terminer une partie fait
// monter le dragon, l'annuler le fait redescendre — tout reste cohérent.

/** XP gagnée pour une partie terminée (module de leçon ou session d'exercices). */
export const XP_PER_STEP = 10;

/** XP nécessaire pour passer un niveau (barème fixe). */
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
// Seuils calés sur le barème 10 XP / partie : niveaux 1, 4, 11, 26, 51 et 91.
export const DRAGON_STAGES: DragonStage[] = [
  { key: "egg",        name: "Œuf",        img: "/dragons/egg.svg",        emoji: "🥚", tagline: "Nouveau départ",   minXp: 0,    color: "#B0843A" },
  { key: "hatchling",  name: "Éclosion",   img: "/dragons/hatchling.svg",  emoji: "🐣", tagline: "Premiers mots",    minXp: 300,  color: "#C99A46" },
  { key: "apprentice", name: "Apprenti",   img: "/dragons/apprentice.svg", emoji: "🦎", tagline: "Phrases simples",  minXp: 1000, color: "#6E8B5B" },
  { key: "adventurer", name: "Aventurier", img: "/dragons/adventurer.svg", emoji: "🐲", tagline: "Conversations",    minXp: 2500, color: "#3E7CA6" },
  { key: "master",     name: "Maître",     img: "/dragons/master.svg",     emoji: "🐉", tagline: "Maîtrise avancée", minXp: 5000, color: "#8A5BB0" },
  { key: "legendary",  name: "Légendaire", img: "/dragons/legendary.svg",  emoji: "🐉", tagline: "Niveau expert",    minXp: 9000, color: "#C2402F" },
];

/** XP totale correspondant à `steps` parties terminées. */
export function xpForSteps(steps: number): number {
  return Math.max(0, steps) * XP_PER_STEP;
}

/**
 * Nombre de parties terminées à partir des codes validés.
 * Une partie = un module de leçon du curriculum, ou une session d'exercices
 * (codes préfixés `EX:`). Les codes inconnus sont ignorés.
 */
export function countSteps(validated: Set<string>, lessonCodes: Set<string>): number {
  let n = 0;
  for (const code of validated) {
    if (lessonCodes.has(code) || code.startsWith("EX:")) n += 1;
  }
  return n;
}

export interface DragonState {
  /** Parties terminées (modules de leçon + sessions d'exercices). */
  lessonsDone: number;
  totalLessons: number;
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

/** Calcule l'état complet du dragon à partir du nombre de parties terminées. */
export function computeDragon(lessonsDone: number, totalLessons: number): DragonState {
  const xp = xpForSteps(lessonsDone);

  // — Niveau : marche fixe de 100 XP (soit 10 parties par niveau).
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
    lessonsDone,
    totalLessons,
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
