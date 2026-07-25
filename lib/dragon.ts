// lib/dragon.ts — Modèle de gamification « Dragon ».
//
// Le dragon évolue avec l'apprentissage : chaque module de leçon validé
// rapporte de l'expérience (XP). L'XP détermine à la fois un NIVEAU (la barre
// de progression « EXP x / y ») et un STADE d'évolution (l'apparence du
// dragon : œuf → … → légendaire).
//
// La progression est dérivée DIRECTEMENT des leçons validées
// (lib/lesson-progress) : rien de plus à stocker. Valider une leçon fait
// monter le dragon, l'annuler le fait redescendre — tout reste cohérent.
// Quand les leçons passeront en base, il suffira de brancher `lessonsDone`
// sur la table de progression du compte.

export const XP_PER_LESSON = 100;

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
export const DRAGON_STAGES: DragonStage[] = [
  { key: "egg",        name: "Œuf",        img: "/dragons/egg.svg",        emoji: "🥚", tagline: "Nouveau départ",   minXp: 0,     color: "#B0843A" },
  { key: "hatchling",  name: "Éclosion",   img: "/dragons/hatchling.svg",  emoji: "🐣", tagline: "Premiers mots",    minXp: 300,   color: "#C99A46" },
  { key: "apprentice", name: "Apprenti",   img: "/dragons/apprentice.svg", emoji: "🦎", tagline: "Phrases simples",  minXp: 1500,  color: "#6E8B5B" },
  { key: "adventurer", name: "Aventurier", img: "/dragons/adventurer.svg", emoji: "🐲", tagline: "Conversations",    minXp: 4000,  color: "#3E7CA6" },
  { key: "master",     name: "Maître",     img: "/dragons/master.svg",     emoji: "🐉", tagline: "Maîtrise avancée", minXp: 9000,  color: "#8A5BB0" },
  { key: "legendary",  name: "Légendaire", img: "/dragons/legendary.svg",  emoji: "🐉", tagline: "Niveau expert",    minXp: 18000, color: "#C2402F" },
];

/** XP nécessaire pour passer de `level` à `level + 1`. La marche s'élargit
 * doucement : ~1 leçon par niveau au début, un peu plus ensuite. */
function levelSpan(level: number): number {
  return 100 + (level - 1) * 25;
}

export function xpForLessons(lessonsDone: number): number {
  return Math.max(0, lessonsDone) * XP_PER_LESSON;
}

export interface DragonState {
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

/** Calcule l'état complet du dragon à partir du nombre de leçons validées. */
export function computeDragon(lessonsDone: number, totalLessons: number): DragonState {
  const xp = xpForLessons(lessonsDone);

  // — Niveau : on empile les marches tant que l'XP les couvre.
  let level = 1;
  let cum = 0;
  while (cum + levelSpan(level) <= xp) {
    cum += levelSpan(level);
    level += 1;
  }
  const xpForLevel = levelSpan(level);
  const xpIntoLevel = xp - cum;
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
