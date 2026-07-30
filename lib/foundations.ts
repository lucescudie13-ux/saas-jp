// lib/foundations.ts — La catégorie préliminaire, avant le N5.
//
// « Comprendre comment le japonais fonctionne, et comment l'apprendre » : ce
// qu'on gagne à savoir AVANT d'attaquer le vocabulaire et la grammaire. C'est
// la première chose que voit un nouvel inscrit sur son plan d'étude.
//
// Le contenu de ces leçons vit ICI (il a été déplacé depuis lib/vrac.ts, qui
// reste le brouillon). Seuls les TYPES sont importés de vrac : ce sont des
// types de contenu de cours génériques, partagés avec le brouillon et le
// composant CourseSections.

import type { VracLesson } from "./vrac";

/** Étiquette courte, à la place du badge de niveau (N5, N4…). */
export const FOUNDATIONS_BADGE = "★";

/** Nom de la catégorie dans le plan. */
export const FOUNDATIONS_LABEL = "Les bases";

/** Sous-titre : ce que couvre la catégorie. */
export const FOUNDATIONS_TITLE = "Fonctionnement du japonais et méthode de travail";

export const FOUNDATIONS_INTRO =
  "Avant le vocabulaire et la grammaire : comment la langue est construite, " +
  "et comment l'apprendre sans perdre de temps.";

/**
 * Les leçons préliminaires, dans l'ordre de lecture.
 *
 * Ouvertes à TOUT LE MONDE, sans abonnement ni progression : c'est de la
 * méthode, pas du contenu à protéger, et c'est ce qu'un nouvel inscrit doit
 * pouvoir lire avant de décider s'il paie.
 */
export const FOUNDATION_LESSONS: VracLesson[] = [
  {
    slug: "comment-fonctionne-la-conjugaison",
    title: "Comment fonctionne la conjugaison",
    summary:
      "Le système de conjugaison japonais expliqué simplement — la logique de base avant de plonger dans les temps et les formes.",
    video: "", // ← colle ici le lien de la vidéo (YouTube) quand tu l'as
    tags: ["grammaire", "bases"],
    sections: [
      {
        heading: "L'idée clé",
        paragraphs: [
          "En japonais, un verbe ne change pas selon la personne (je, tu, il…) ni le nombre. « manger » se dit 食べる (taberu), que le sujet soit « je » ou « ils ».",
          "Ce qui change, c'est la terminaison du verbe, selon le temps, la politesse et la nuance (négation, volonté, capacité…). Conjuguer = transformer cette terminaison.",
        ],
      },
      {
        heading: "Les trois groupes de verbes",
        paragraphs: [
          "1. Verbes en -る dits « ichidan » (une base) : on enlève juste る. Ex. 食べる → 食べ. Simples et réguliers.",
          "2. Verbes « godan » (cinq bases) : la dernière syllabe change de ligne dans le tableau des kana. Ex. 飲む (nomu) → 飲みます, 飲まない…",
          "3. Les deux irréguliers : する (faire) et 来る (venir). À apprendre par cœur, ils reviennent partout.",
        ],
      },
      {
        heading: "Forme du dictionnaire vs forme polie",
        paragraphs: [
          "La forme du dictionnaire (食べる, 飲む) est la forme neutre, utilisée entre proches et pour construire d'autres formes.",
          "La forme polie en -ます (食べます, 飲みます) est celle qu'on utilise par défaut avec les gens qu'on ne connaît pas. C'est souvent par elle qu'on commence.",
        ],
      },
      {
        heading: "À compléter",
        paragraphs: [
          "Ajoute ici tes exemples, tes tableaux et le lien de la vidéo. Cette leçon sert de gabarit : chaque nouvelle idée de « Vrac » aura la même mise en page (vidéo + texte).",
        ],
      },
    ],
  },
  {
    slug: "comment-fonctionne-l-ecriture",
    title: "Comment fonctionne l'écriture",
    summary:
      "Les trois systèmes d'écriture japonais — hiragana, katakana, kanji — et comment ils se combinent dans une même phrase.",
    video: "",
    tags: ["écriture", "bases"],
    sections: [
      {
        heading: "Trois systèmes, un seul texte",
        paragraphs: [
          "Le japonais s'écrit avec trois systèmes mélangés dans la même phrase : les hiragana, les katakana et les kanji. Ça paraît intimidant, mais chacun a un rôle précis.",
        ],
      },
      {
        heading: "Hiragana & katakana : les syllabaires",
        paragraphs: [
          "Ce sont deux alphabets de ~46 signes, où chaque signe représente une syllabe (か = ka, き = ki…).",
          "Les hiragana servent à la grammaire et aux mots japonais ; les katakana servent surtout aux mots étrangers (コーヒー = kōhī, « café »). Ce sont les deux premières choses à apprendre.",
        ],
      },
      {
        heading: "Kanji : les idéogrammes",
        paragraphs: [
          "Les kanji sont des caractères venus du chinois qui portent un sens (山 = montagne, 食 = manger). Chaque kanji a une ou plusieurs lectures selon le contexte.",
          "On les apprend progressivement, par niveau — inutile de tout mémoriser d'un coup.",
        ],
      },
      {
        heading: "À compléter",
        paragraphs: ["Ajoute ici tes tableaux de kana, tes exemples et le lien de la vidéo."],
      },
    ],
  },
  {
    slug: "comment-fonctionne-la-grammaire",
    title: "Comment fonctionne la grammaire",
    summary:
      "La logique de la phrase japonaise — ordre des mots, particules — et pourquoi c'est plus régulier qu'il n'y paraît.",
    video: "",
    tags: ["grammaire", "bases"],
    sections: [
      {
        heading: "L'ordre de la phrase : SOV",
        paragraphs: [
          "En japonais, le verbe se place à la fin. L'ordre de base est Sujet – Objet – Verbe : « je sushi mange » plutôt que « je mange des sushis ».",
        ],
      },
      {
        heading: "Les particules : les étiquettes des mots",
        paragraphs: [
          "De petites particules se placent après chaque mot pour indiquer son rôle : は (thème), が (sujet), を (objet), に (lieu/temps), で (moyen/lieu de l'action)…",
          "C'est la clé de la grammaire japonaise : une fois qu'on comprend les particules, l'ordre des mots devient beaucoup plus souple.",
        ],
      },
      {
        heading: "Ce qui simplifie",
        paragraphs: [
          "Pas de genre (masculin/féminin), pas d'accord, pas de pluriel obligatoire, pas d'articles (le/la/un). Beaucoup de « difficultés » du français n'existent tout simplement pas.",
        ],
      },
      {
        heading: "À compléter",
        paragraphs: ["Ajoute ici tes exemples de particules, tes schémas de phrase et le lien de la vidéo."],
      },
    ],
  },
  {
    slug: "comment-fonctionne-la-prononciation",
    title: "Comment fonctionne la prononciation",
    summary:
      "La prononciation japonaise — des syllabes régulières, cinq voyelles, et l'accent de hauteur — plus simple que le français à bien des égards.",
    video: "",
    tags: ["prononciation", "bases"],
    sections: [
      {
        heading: "Des syllabes régulières",
        paragraphs: [
          "Le japonais se décompose en petites unités (les mores) qui se prononcent toutes avec la même durée : か-き-く (ka-ki-ku). Chaque signe se lit toujours pareil — pas de lettres muettes ni de pièges comme en français.",
        ],
      },
      {
        heading: "Cinq voyelles, toujours les mêmes",
        paragraphs: [
          "Il n'y a que 5 voyelles : a, i, u, e, o. Elles se prononcent toujours de façon identique (a comme dans « papa », i comme « lit »…). Une fois apprises, tout se lit sans surprise.",
        ],
      },
      {
        heading: "L'accent de hauteur (pitch)",
        paragraphs: [
          "Le japonais n'accentue pas en tapant sur une syllabe (comme le français), mais en montant ou descendant la voix. はし peut vouloir dire « pont » ou « baguettes » selon la hauteur.",
          "Bonne nouvelle : ce ne sont pas des tons comme en chinois, et se tromper d'accent gêne rarement la compréhension au début.",
        ],
      },
      {
        heading: "À compléter",
        paragraphs: ["Ajoute ici tes exemples d'accent de hauteur, tes minimal pairs et le lien de la vidéo."],
      },
    ],
  },
];

export function foundationLessons(): VracLesson[] {
  return FOUNDATION_LESSONS;
}

export function getFoundationLesson(slug: string): VracLesson | undefined {
  return FOUNDATION_LESSONS.find((l) => l.slug === slug);
}
