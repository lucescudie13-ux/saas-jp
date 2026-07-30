// lib/onboarding.ts — Le tutoriel de bienvenue : contenu et mémoire.
//
// Les textes sont ici, séparés du composant, pour être relus et corrigés sans
// toucher au code de l'animation.

const KEY = "hibi-onboarding-v1";

export interface OnboardingStep {
  /** Emoji repère, en écho à la barre latérale. */
  icon: string;
  title: string;
  /** Deux phrases au maximum : un tutoriel qu'on lit, pas qu'on subit. */
  text: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    icon: "🐉",
    title: "Bienvenue chez Hibi",
    text:
      "Je suis ton guide. En une minute, je te montre où tout se trouve — " +
      "ensuite tu n'auras plus qu'à apprendre, jour après jour.",
  },
  {
    icon: "🗺️",
    title: "Ton plan d'étude",
    text:
      "C'est ta page d'accueil : « Les bases » pour comprendre comment le japonais " +
      "fonctionne, puis les cinq niveaux du JLPT, du N5 au N1. Chaque case numérotée est une leçon.",
  },
  {
    icon: "📘",
    title: "Une leçon, trois parties",
    text:
      "Vocabulaire, grammaire et conjugaison. Une partie se valide quand tu as fait ses " +
      "exercices jusqu'au bout — pas avant, pour que ta progression dise la vérité.",
  },
  {
    icon: "🥚",
    title: "Ton dragon grandit avec toi",
    text:
      "Une leçon terminée vaut 100 points d'expérience, soit un niveau de dragon. " +
      "Il éclôt, grandit et évolue à mesure que tu avances : ta progression prend forme.",
  },
  {
    icon: "語",
    title: "Tes listes de référence",
    text:
      "Vocabulaire, grammaire et conjugaison rassemblés au même endroit. Le contenu se " +
      "dévoile leçon après leçon : ce que tu débloques reste consultable à volonté.",
  },
  {
    icon: "🎯",
    title: "L'entraînement libre",
    text:
      "Des exercices supplémentaires et des outils d'expression, écrite comme orale, " +
      "pour travailler un point précis en dehors du parcours.",
  },
  {
    icon: "✨",
    title: "À toi de jouer",
    text:
      "Commence par « Les bases », puis attaque la leçon 1 du N5. Tu peux revoir ce " +
      "tutoriel à tout moment depuis ton profil.",
  },
];

/** Le tutoriel a-t-il déjà été vu ? Lu dans localStorage : aucune requête, donc
 *  aucun temps d'attente au premier rendu. */
export function onboardingSeen(): boolean {
  if (typeof window === "undefined") return true; // rien au rendu serveur
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return true; // stockage indisponible → ne pas importuner l'utilisateur
  }
}

export function markOnboardingSeen(): void {
  try {
    window.localStorage.setItem(KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Rejoue le tutoriel (bouton du profil). */
export function resetOnboarding(): void {
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("hibi-onboarding-replay"));
  } catch {
    /* ignore */
  }
}
