// lib/vrac.ts — « Vrac » : boîte à idées de cours à organiser dans la roadmap.
// Hiérarchie : Vrac (catégorie) → sous-catégories → leçons.
// Contenu statique (facile à étendre : ajoute une leçon à un groupe, ou un
// nouveau groupe). Chaque leçon s'affiche avec le template de cours (vidéo + texte).

import type { VocabFicheData } from "@/components/features/VocabFiche";

/** Une étape de l'emboîtement d'une forme (jp + lecture + sens). */
export interface VracChainStep {
  jp: string;
  romaji?: string;
  fr?: string;
}

/** Un exemple : phrase japonaise + traduction. */
export interface VracExample {
  jp: string;
  fr: string;
}

/** Une ligne du tableau « erreurs à éviter ». */
export interface VracMistake {
  ok: boolean;
  form: string;
  note: string;
}

/** Un tableau simple (en-têtes optionnels + lignes de cellules). */
export interface VracTable {
  headers?: string[];
  rows: string[][];
}

/**
 * Un « jeton » de phrase japonaise : le mot tel qu'écrit + sa fiche de
 * dictionnaire (lecture, sens, nature). Affiché au survol / au clic.
 * `plain: true` → simple texte non interactif (ponctuation, espace…).
 */
export interface VracToken {
  /** Surface : le mot tel qu'il apparaît dans la phrase. */
  w: string;
  /** Lecture (kana et/ou rōmaji). */
  reading?: string;
  /** Sens en français. */
  meaning?: string;
  /** Nature grammaticale (nom, verbe, particule…). */
  pos?: string;
  /** Non interactif (ponctuation, espace). */
  plain?: boolean;
}

/** Une phrase d'exercice de traduction : japonais → langue cible. */
export interface VracTranslationItem {
  jp: string;
  reading?: string;
  answer: string;
  note?: string;
}

export interface VracSection {
  /** Titre de section (optionnel). */
  heading?: string;
  /** Paragraphes de la section. */
  paragraphs?: string[];
  /** Encadré mis en avant (formule, point essentiel, à retenir…). */
  callout?: string;
  /** Tableau (formation, comparaison…). */
  table?: VracTable;
  /** Chaîne d'emboîtement d'une forme, rendue en étapes reliées. */
  chain?: VracChainStep[];
  /** Cartes d'exemples (japonais + traduction). */
  examples?: VracExample[];
  /** Liste « erreurs à éviter » avec ✕ / ○. */
  mistakes?: VracMistake[];
  /** Phrase japonaise interactive : dictionnaire au survol / au clic.
   * `size: "sm"` → texte plus compact, adapté à un paragraphe de lecture. */
  sentence?: { tokens: VracToken[]; size?: "sm" };
  /** Exercice de traduction (JP → langue cible), rendu en fin de section. */
  exercise?: { targetLabel?: string; items: VracTranslationItem[] };
}

export interface VracLesson {
  /** Identifiant dans l'URL : /vrac/<slug>. */
  slug: string;
  title: string;
  summary?: string;
  /** Lien audio (mp3/ogg…) de la leçon. Vide = design d'attente. */
  audio?: string;
  /** Lien vidéo (déprécié — les cours mènent désormais par l'audio). */
  video?: string;
  /** Corps du cours, en sections. */
  sections?: VracSection[];
  /** Fiche de vocabulaire détaillée (rendu identique au tiroir du vocabulaire).
   * Si présente, la leçon affiche cette fiche à la place des sections. */
  vocabFiche?: VocabFicheData;
  /** Exercice de fin de leçon (10 questions) — accessible via un bouton en bas. */
  exercise?: { targetLabel?: string; items: VracTranslationItem[] };
  /** Étiquettes libres pour trier/organiser plus tard. */
  tags?: string[];
}

/** Sous-catégorie : un groupe de leçons sous un même thème. */
export interface VracGroup {
  title: string;
  lessons: VracLesson[];
}

export const VRAC_GROUPS: VracGroup[] = [
  {
    title: "Fonctionnement du japonais",
    lessons: [
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
    ],
  },
  {
    title: "Démo",
    lessons: [
      {
        slug: "demo-dictionnaire-survol",
        title: "Dictionnaire au survol — démo",
        summary:
          "Test de la fiche-dictionnaire : passe la souris sur un mot japonais (ou touche-le sur mobile) pour voir sa lecture, sa nature et son sens.",
        audio: "",
        tags: ["démo", "dictionnaire"],
        sections: [
          {
            heading: "Essaie sur cette phrase",
            paragraphs: [
              "Survole chaque mot souligné avec la souris (sur ordinateur) ou touche-le (sur mobile) pour ouvrir sa fiche. Les définitions ci-dessous sont provisoires — elles seront remplacées par la vraie base de données du dictionnaire.",
            ],
            sentence: {
              tokens: [
                { w: "私", reading: "わたし・watashi", pos: "pronom", meaning: "je, moi" },
                { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
                { w: "毎朝", reading: "まいあさ・maiasa", pos: "nom / adverbe", meaning: "chaque matin, tous les matins" },
                { w: "コーヒー", reading: "kōhī", pos: "nom", meaning: "café (la boisson)" },
                { w: "を", reading: "o", pos: "particule", meaning: "marque le complément d'objet direct" },
                { w: "飲みます", reading: "のみます・nomimasu", pos: "verbe — forme polie", meaning: "boire (de 飲む, nomu)" },
                { w: "。", plain: true },
              ],
            },
          },
          {
            heading: "Traduction",
            paragraphs: ["« Je bois du café tous les matins. »"],
          },
        ],
      },
      {
        slug: "demo-exercice-traduction",
        title: "Exercice de traduction — démo",
        summary:
          "Dix phrases japonaises à traduire en français. Écris ta traduction, compare avec le modèle, puis auto-évalue-toi.",
        sections: [
          {
            heading: "Traduis les phrases",
            paragraphs: [
              "Lis chaque phrase, écris ta traduction en français, puis affiche le modèle pour te corriger. Contenu de démonstration — il sera remplacé par la vraie base plus tard.",
            ],
            exercise: {
              targetLabel: "français",
              items: [
                {
                  jp: "私は毎朝、コーヒーを飲みながら新聞を読みます。",
                  reading: "わたしは まいあさ、コーヒーを のみながら しんぶんを よみます。",
                  answer: "Chaque matin, je lis le journal en buvant un café.",
                },
                {
                  jp: "明日は友だちと駅で会って、一緒に映画を見に行きます。",
                  reading: "あしたは ともだちと えきで あって、いっしょに えいがを みに いきます。",
                  answer: "Demain, je retrouve un ami à la gare et nous allons voir un film ensemble.",
                },
                {
                  jp: "この本はとても面白いですが、漢字が多くて少し難しいです。",
                  reading: "この ほんは とても おもしろいですが、かんじが おおくて すこし むずかしいです。",
                  answer: "Ce livre est très intéressant, mais il y a beaucoup de kanji et c'est un peu difficile.",
                },
                {
                  jp: "すみません、駅はどこにありますか。歩いて行けますか。",
                  reading: "すみません、えきは どこに ありますか。あるいて いけますか。",
                  answer: "Excusez-moi, où se trouve la gare ? Peut-on y aller à pied ?",
                },
                {
                  jp: "週末はいつも家で日本語を勉強したり、音楽を聞いたりします。",
                  reading: "しゅうまつは いつも いえで にほんごを べんきょうしたり、おんがくを きいたり します。",
                  answer: "Le week-end, je fais des choses comme étudier le japonais ou écouter de la musique à la maison.",
                  note: "〜たり〜たりする sert à citer des activités parmi d'autres, sans être exhaustif.",
                },
                {
                  jp: "彼女はまだ学生ですが、来年から会社で働くつもりです。",
                  reading: "かのじょは まだ がくせいですが、らいねんから かいしゃで はたらく つもりです。",
                  answer: "Elle est encore étudiante, mais elle compte travailler dans une entreprise à partir de l'année prochaine.",
                },
                {
                  jp: "昨日は天気がよかったので、公園を長い間散歩しました。",
                  reading: "きのうは てんきが よかったので、こうえんを ながい あいだ さんぽしました。",
                  answer: "Comme il faisait beau hier, je me suis promené longtemps dans le parc.",
                },
                {
                  jp: "毎日電車で会社に行きますが、朝はとても込んでいます。",
                  reading: "まいにち でんしゃで かいしゃに いきますが、あさは とても こんでいます。",
                  answer: "Je vais au travail en train tous les jours, mais le matin c'est très bondé.",
                },
                {
                  jp: "日本の食べ物の中で、寿司とラーメンが一番好きです。",
                  reading: "にほんの たべものの なかで、すしと ラーメンが いちばん すきです。",
                  answer: "Parmi les plats japonais, ce que je préfère, ce sont les sushis et les ramen.",
                },
                {
                  jp: "時間があるとき、写真を撮りに近くの海へ行きます。",
                  reading: "じかんが あるとき、しゃしんを とりに ちかくの うみへ いきます。",
                  answer: "Quand j'ai du temps, je vais à la mer près de chez moi pour prendre des photos.",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    title: "Conjugaison",
    lessons: [
      {
        slug: "la-demande-negative-naide-kudasai",
        title: "La demande négative — 〜ないでください",
        summary:
          "Comprendre comment demander poliment à quelqu'un de ne pas accomplir une action, former correctement la structure avec les trois groupes de verbes et éviter les erreurs les plus fréquentes.",
        audio: "", // ← colle ici le lien audio (mp3/ogg) de la leçon quand tu l'as
        tags: ["conjugaison", "N5", "politesse"],
        sections: [
          {
            heading: "La demande négative en japonais",
            paragraphs: [
              "La structure 〜ないでください sert à demander poliment à une personne de ne pas faire quelque chose. Elle correspond généralement à « s'il vous plaît, ne… pas » ou à « veuillez ne pas… ».",
              "On l'emploie notamment pour donner une consigne, formuler un avertissement, transmettre un conseil ou demander l'arrêt d'un comportement.",
            ],
            callout: "Formule générale — Verbe à la forme négative en ない + でください → V-ないでください",
          },
          {
            heading: "1. La formation de 〜ないでください",
            paragraphs: [
              "La construction part du négatif neutre du verbe. Une fois la forme en ない obtenue, il suffit d'ajouter でください. Le verbe ne se met donc pas en 〜ません devant cette formule.",
            ],
            table: {
              headers: ["Groupe", "Verbe", "Forme obtenue", "Sens"],
              rows: [
                ["Groupe 1", "書く（かく・kaku）", "書かないでください", "N'écrivez pas, s'il vous plaît."],
                ["Groupe 1", "買う（かう・kau）", "買わないでください", "N'achetez pas, s'il vous plaît."],
                ["Groupe 2", "食べる（たべる・taberu）", "食べないでください", "Ne mangez pas, s'il vous plaît."],
                ["Groupe 2", "見る（みる・miru）", "見ないでください", "Ne regardez pas, s'il vous plaît."],
                ["Irrégulier", "する（suru）", "しないでください", "Ne faites pas, s'il vous plaît."],
                ["Irrégulier", "来る（くる・kuru）", "来ないでください", "Ne venez pas, s'il vous plaît."],
              ],
            },
          },
          {
            heading: "Les règles par groupe",
            paragraphs: [
              "Groupe 1 : la dernière syllabe passe sur la ligne en a, puis on ajoute ないでください. Avec les verbes en う, on utilise わ : 買う → 買わないでください.",
              "Groupe 2 : on retire le る, puis on ajoute ないでください : 食べる → 食べないでください.",
              "Irréguliers : する devient しないでください et 来る devient 来ないでください（こないでください）.",
            ],
          },
          {
            heading: "2. L'emboîtement de la formule",
            paragraphs: [
              "Comme dans les autres constructions verbales japonaises, les éléments s'ajoutent les uns aux autres. On construit d'abord le négatif, puis la liaison en で, et enfin la demande polie avec ください.",
            ],
            chain: [
              { jp: "読む", romaji: "yomu", fr: "lire" },
              { jp: "読ま", romaji: "yoma", fr: "base négative" },
              { jp: "読まない", romaji: "yomanai", fr: "ne pas lire" },
              { jp: "読まないで", romaji: "yomanaide", fr: "ne lis pas / sans lire" },
              { jp: "読まないでください", romaji: "yomanaide kudasai", fr: "veuillez ne pas lire" },
            ],
            callout:
              "Point essentiel — Même si l'ensemble est poli grâce à ください, le verbe qui précède reste au négatif neutre en ない : 飲まないでください, et non 飲みませんでください.",
          },
          {
            heading: "3. Demande affirmative et demande négative",
            paragraphs: [
              "La forme affirmative emploie la forme suspensive en 〜て／〜で suivie de ください. Pour demander de ne pas faire l'action, on remplace cette base par la forme en 〜ないで.",
            ],
            table: {
              headers: ["Type", "Japonais", "Traduction"],
              rows: [
                ["Affirmative", "ここに入ってください。", "Entrez ici, s'il vous plaît."],
                ["Négative", "ここに入らないでください。", "N'entrez pas ici, s'il vous plaît."],
                ["Affirmative", "写真を撮ってください。", "Prenez une photo, s'il vous plaît."],
                ["Négative", "写真を撮らないでください。", "Ne prenez pas de photo, s'il vous plaît."],
              ],
            },
          },
          {
            heading: "4. Nuance et situations d'emploi",
            paragraphs: [
              "〜ないでください est poli, mais la demande reste assez directe. Cette structure convient naturellement aux consignes, aux avertissements, aux recommandations médicales et aux demandes claires adressées à une autre personne.",
            ],
            examples: [
              { jp: "ここでたばこを吸わないでください。", fr: "Ne fumez pas ici, s'il vous plaît." },
              { jp: "危ないですから、触らないでください。", fr: "C'est dangereux, alors n'y touchez pas." },
              { jp: "この薬を飲んだあと、運転しないでください。", fr: "Après avoir pris ce médicament, ne conduisez pas." },
              { jp: "心配しないでください。", fr: "Ne vous inquiétez pas." },
            ],
          },
          {
            heading: "5. Adoucir la demande avec ね",
            paragraphs: [
              "L'ajout de ね à la fin peut rendre la formulation plus douce et plus attentive. Le locuteur présente alors la demande comme un conseil ou une précaution partagée, plutôt que comme une interdiction sèche.",
            ],
            examples: [
              { jp: "無理をしないでくださいね。", fr: "Ne forcez pas trop, d'accord ? / Prenez soin de vous." },
            ],
          },
          {
            heading: "6. Les erreurs à éviter",
            mistakes: [
              { ok: false, form: "食べませんでください", note: "La politesse ne se construit pas avec 〜ません devant でください." },
              { ok: false, form: "食べないください", note: "Il manque で entre la forme négative et ください." },
              { ok: false, form: "食べなくてください", note: "Pour cette demande négative, on utilise 〜ないで, et non 〜なくて." },
              { ok: true, form: "食べないでください", note: "Forme correcte : négatif en 〜ない + でください." },
            ],
          },
          {
            heading: "7. 〜ないで sans ください",
            paragraphs: [
              "Sans ください, 〜ないで peut former une demande familière ou émotionnelle : 泣かないで signifie « ne pleure pas ».",
              "Devant une autre action, la même forme peut aussi signifier « sans faire » : 朝ご飯を食べないで学校へ行きました, « je suis allé à l'école sans prendre de petit-déjeuner ».",
            ],
            callout:
              "À retenir — Pour demander poliment à quelqu'un de ne pas faire une action : forme négative en ない + でください. La structure complète se mémorise comme un seul bloc : V-ないでください.",
          },
          {
            heading: "Sources pédagogiques",
            paragraphs: [
              "Japan Foundation — Irodori, notes grammaticales et exercices.",
              "Japan Foundation — Marugoto, points pédagogiques du niveau élémentaire.",
            ],
          },
        ],
        exercise: {
          targetLabel: "français",
          items: [
            {
              jp: "ここでたばこを吸わないでください。",
              reading: "ここで たばこを すわないで ください。",
              answer: "Ne fumez pas ici, s'il vous plaît.",
            },
            {
              jp: "写真を撮らないでください。",
              reading: "しゃしんを とらないで ください。",
              answer: "Ne prenez pas de photo, s'il vous plaît.",
            },
            {
              jp: "この部屋に入らないでください。",
              reading: "この へやに はいらないで ください。",
              answer: "N'entrez pas dans cette pièce.",
            },
            {
              jp: "危ないですから、窓を開けないでください。",
              reading: "あぶないですから、まどを あけないで ください。",
              answer: "C'est dangereux, alors n'ouvrez pas la fenêtre.",
            },
            {
              jp: "心配しないでください、大丈夫です。",
              reading: "しんぱいしないで ください、だいじょうぶです。",
              answer: "Ne vous inquiétez pas, tout va bien.",
            },
            {
              jp: "まだ食べないでください。少し待ってください。",
              reading: "まだ たべないで ください。すこし まってください。",
              answer: "Ne mangez pas encore. Attendez un peu, s'il vous plaît.",
            },
            {
              jp: "ここに車を止めないでください。",
              reading: "ここに くるまを とめないで ください。",
              answer: "Ne garez pas votre voiture ici.",
            },
            {
              jp: "大きい声で話さないでください。",
              reading: "おおきい こえで はなさないで ください。",
              answer: "Ne parlez pas fort, s'il vous plaît.",
            },
            {
              jp: "授業中は日本語以外の言葉を話さないでください。",
              reading: "じゅぎょうちゅうは にほんご いがいの ことばを はなさないで ください。",
              answer: "Pendant le cours, ne parlez pas d'autre langue que le japonais.",
            },
            {
              jp: "無理をしないでくださいね。",
              reading: "むりを しないで くださいね。",
              answer: "Ne forcez pas trop, d'accord ?",
              note: "La particule ね adoucit la demande, comme un conseil bienveillant.",
            },
          ],
        },
      },
    ],
  },
  {
    title: "Grammaire",
    lessons: [
      {
        slug: "la-copule-neutre-et-polie",
        title: "La copule neutre et polie — N／A-na + だ・です",
        summary:
          "Construire une phrase qui identifie, classe ou décrit un élément avec un nom ou un adjectif en な, et choisir correctement entre le registre neutre en だ et le registre poli en です.",
        audio: "", // ← colle ici le lien audio (mp3/ogg) de la leçon quand tu l'as
        tags: ["grammaire", "N5", "copule"],
        sections: [
          {
            heading: "Comprendre la règle",
            paragraphs: [
              "En japonais, une phrase dont le prédicat est un nom ou un adjectif en な se termine normalement par une copule. La copule ne correspond pas toujours mot à mot au verbe français « être » : elle sert surtout à fermer la phrase et à présenter l'élément précédent comme une information complète.",
            ],
            callout: "Formule générale — Nom ou base d'adjectif en な + だ (neutre) / です (poli)",
          },
          {
            heading: "1. La formation de N／A-na + だ・です",
            paragraphs: [
              "On place le nom ou la base de l'adjectif en な juste avant la copule. La forme ne varie ni selon la personne ni selon le nombre : seul le niveau de politesse change ici.",
            ],
            table: {
              headers: ["Type", "Élément", "Forme obtenue", "Sens"],
              rows: [
                ["Nom", "学生（がくせい）", "学生だ。", "C'est un étudiant. / Je suis étudiant."],
                ["Nom", "先生（せんせい）", "田中さんは先生です。", "M. Tanaka est professeur."],
                ["A-na", "静か（しずか）", "この町は静かだ。", "Cette ville est calme."],
                ["A-na", "便利（べんり）", "このアプリは便利です。", "Cette application est pratique."],
              ],
            },
          },
          {
            heading: "La règle en pratique",
            paragraphs: [
              "Nom : placez だ au registre neutre ou です au registre poli.",
              "Adjectif en な : employez la base seule devant la copule : 静かだ／静かです.",
              "Choix : だ et です sont deux fermetures alternatives ; ne les cumulez jamais.",
            ],
          },
          {
            heading: "2. L'emboîtement et la logique de la structure",
            paragraphs: [
              "Le japonais organise souvent la phrase comme « thème + information à propos du thème ». La copule vient après l'information principale. Dans 私は学生です, 私は annonce le thème « moi », 学生 donne l'identité, et です ferme la phrase poliment.",
            ],
            chain: [
              { jp: "私は", romaji: "watashi wa", fr: "thème : moi" },
              { jp: "学生", romaji: "gakusei", fr: "information : étudiant" },
              { jp: "です", romaji: "desu", fr: "fermeture polie" },
            ],
            callout:
              "Point essentiel — だ et です occupent la même position, mais ne s'additionnent pas. On dit 学生だ ou 学生です, jamais 学生だです.",
          },
          {
            heading: "3. À ne pas confondre",
            table: {
              headers: ["Forme", "Analyse", "Statut / sens"],
              rows: [
                ["学生だ。", "neutre", "correct"],
                ["学生です。", "poli", "correct"],
                ["学生だです。", "mélange de deux copules", "incorrect"],
                ["高いです。", "adjectif en い + marque polie", "correct, mais ce n'est pas A-na + です"],
              ],
            },
          },
          {
            heading: "4. Nuance et situations d'emploi",
            paragraphs: [
              "だ : registre neutre — conversation familière, journal personnel, narration directe ; le ton peut sembler abrupt selon la situation.",
              "です : registre poli standard — conversation avec une personne peu proche, service, cours ou contexte professionnel ordinaire.",
              "Omission : dans une conversation très familière, だ peut être omis : 私、学生。 La phrase devient plus relâchée et dépend davantage de l'intonation.",
              "Portée : cette règle concerne les noms et les adjectifs en な. Un adjectif en い ne prend pas だ au présent affirmatif.",
            ],
          },
          {
            heading: "5. Exemples commentés",
            examples: [
              { jp: "私はフランス人です。", fr: "Je suis français(e). — présentation polie" },
              { jp: "あの建物は図書館だ。", fr: "Ce bâtiment-là est une bibliothèque. — constat neutre" },
              { jp: "この部屋はきれいです。", fr: "Cette pièce est propre / jolie. — A-na + です" },
              { jp: "今日は暇だ。", fr: "Aujourd'hui, je suis libre. — sujet compris par le contexte" },
            ],
          },
          {
            heading: "6. Les erreurs à éviter",
            mistakes: [
              { ok: false, form: "静かなです。", note: "Devant la copule, on retire な : 静かです。" },
              { ok: false, form: "学生ですだ。", note: "On choisit だ ou です ; on ne les cumule pas." },
              { ok: false, form: "高いだ。", note: "Un adjectif en い ne prend pas だ au présent affirmatif." },
              { ok: true, form: "この町は静かです。", note: "Base de l'adjectif en な + copule polie." },
            ],
          },
          {
            heading: "7. L'omission de だ dans la langue familière",
            paragraphs: [
              "Dans une conversation très familière, だ peut disparaître lorsque la phrase reste compréhensible : 私、学生。 Cette omission produit un style relâché.",
              "Dans un contexte poli, conservez です : 私は学生です。",
            ],
            callout:
              "À retenir — Avec un nom ou un adjectif en な : base + だ au neutre, base + です au poli. な disparaît devant la copule.",
          },
        ],
        exercise: {
          targetLabel: "français",
          items: [
            {
              jp: "私は学生です。",
              reading: "わたしは がくせいです。",
              answer: "Je suis étudiant(e).",
            },
            {
              jp: "田中さんは先生です。",
              reading: "たなかさんは せんせいです。",
              answer: "M. Tanaka est professeur.",
            },
            {
              jp: "この町は静かです。",
              reading: "この まちは しずかです。",
              answer: "Cette ville est calme.",
            },
            {
              jp: "このアプリは便利です。",
              reading: "この アプリは べんりです。",
              answer: "Cette application est pratique.",
            },
            {
              jp: "あの建物は図書館だ。",
              reading: "あの たてものは としょかんだ。",
              answer: "Ce bâtiment-là est une bibliothèque.",
              note: "だ = constat neutre ; à l'oral poli, on dirait です.",
            },
            {
              jp: "この部屋はきれいです。",
              reading: "この へやは きれいです。",
              answer: "Cette pièce est propre / jolie.",
              note: "きれい est un adjectif en な : base seule + です (pas de な devant la copule).",
            },
            {
              jp: "私はフランス人です。",
              reading: "わたしは フランスじんです。",
              answer: "Je suis français(e).",
            },
            {
              jp: "今日は暇だ。",
              reading: "きょうは ひまだ。",
              answer: "Aujourd'hui, je suis libre.",
            },
            {
              jp: "この問題は簡単です。",
              reading: "この もんだいは かんたんです。",
              answer: "Ce problème est facile.",
            },
            {
              jp: "彼女はとても親切です。",
              reading: "かのじょは とても しんせつです。",
              answer: "Elle est très gentille.",
            },
          ],
        },
      },
    ],
  },
  {
    title: "Compréhension",
    lessons: [
      {
        slug: "lecture-une-journee-ordinaire",
        title: "Lecture — Une journée ordinaire",
        summary:
          "Un court paragraphe à lire avec le dictionnaire intégré : survole un mot (ordinateur) ou touche-le (mobile) pour voir sa lecture, sa nature et son sens.",
        tags: ["compréhension", "lecture", "N5"],
        sections: [
          {
            heading: "Comment lire ce texte",
            paragraphs: [
              "Lis le paragraphe ci-dessous à ton rythme. Chaque mot souligné possède une fiche : passe la souris dessus (sur ordinateur) ou touche-le (sur mobile) pour afficher sa lecture en kana, sa nature grammaticale et son sens en français.",
              "Essaie d'abord de comprendre sans aide, puis vérifie les mots qui te manquent. La traduction complète se trouve juste après le texte.",
            ],
          },
          {
            heading: "Le texte",
            sentence: {
              size: "sm",
              tokens: [
                { w: "私", reading: "わたし・watashi", pos: "pronom", meaning: "je, moi" },
                { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
                { w: "毎朝", reading: "まいあさ・maiasa", pos: "nom / adverbe", meaning: "chaque matin, tous les matins" },
                { w: "七時", reading: "しちじ・shichiji", pos: "nom", meaning: "sept heures" },
                { w: "に", reading: "ni", pos: "particule", meaning: "indique le moment (à…)" },
                { w: "起きます", reading: "おきます・okimasu", pos: "verbe — forme polie", meaning: "se lever (de 起きる, okiru)" },
                { w: "。", plain: true },
                { w: "朝ご飯", reading: "あさごはん・asagohan", pos: "nom", meaning: "petit-déjeuner" },
                { w: "を", reading: "o", pos: "particule", meaning: "marque le complément d'objet direct" },
                { w: "食べてから", reading: "たべてから・tabete kara", pos: "verbe + から", meaning: "après avoir mangé (forme en て + から)" },
                { w: "、", plain: true },
                { w: "電車", reading: "でんしゃ・densha", pos: "nom", meaning: "train" },
                { w: "で", reading: "de", pos: "particule", meaning: "indique le moyen (par, en)" },
                { w: "会社", reading: "かいしゃ・kaisha", pos: "nom", meaning: "entreprise, bureau" },
                { w: "へ", reading: "e", pos: "particule", meaning: "indique la direction (vers)" },
                { w: "行きます", reading: "いきます・ikimasu", pos: "verbe — forme polie", meaning: "aller (de 行く, iku)" },
                { w: "。", plain: true },
                { w: "仕事", reading: "しごと・shigoto", pos: "nom", meaning: "travail, emploi" },
                { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
                { w: "忙しい", reading: "いそがしい・isogashii", pos: "adjectif en い", meaning: "occupé, chargé" },
                { w: "ですが", reading: "desu ga", pos: "copule + が", meaning: "… mais (です + が, opposition)" },
                { w: "、", plain: true },
                { w: "とても", reading: "totemo", pos: "adverbe", meaning: "très" },
                { w: "楽しい", reading: "たのしい・tanoshii", pos: "adjectif en い", meaning: "agréable, plaisant" },
                { w: "です", reading: "desu", pos: "copule polie", meaning: "être (fermeture polie)" },
                { w: "。", plain: true },
                { w: "夜", reading: "よる・yoru", pos: "nom", meaning: "le soir, la nuit" },
                { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
                { w: "家", reading: "いえ・ie", pos: "nom", meaning: "maison, chez soi" },
                { w: "で", reading: "de", pos: "particule", meaning: "indique le lieu de l'action" },
                { w: "日本語", reading: "にほんご・nihongo", pos: "nom", meaning: "japonais (la langue)" },
                { w: "を", reading: "o", pos: "particule", meaning: "marque le complément d'objet direct" },
                { w: "勉強します", reading: "べんきょうします・benkyō shimasu", pos: "verbe — forme polie", meaning: "étudier (de 勉強する, benkyō suru)" },
                { w: "。", plain: true },
              ],
            },
          },
          {
            heading: "Traduction",
            paragraphs: [
              "« Chaque matin, je me lève à sept heures. Après avoir pris mon petit-déjeuner, je vais au travail en train. Mon travail est chargé, mais très agréable. Le soir, j'étudie le japonais à la maison. »",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Vocabulaire",
    lessons: [
      {
        slug: "fiche-vocabulaire-gaku",
        title: "Fiche de vocabulaire — 学 (apprendre)",
        summary:
          "Un exemple de fiche détaillée d'un caractère : sens & composition, décomposition, moyen mnémotechnique, origine, exemples et pièges à éviter — la mise en page prévue pour le vocabulaire.",
        tags: ["vocabulaire", "kanji", "N5"],
        vocabFiche: {
          lemma: "学",
          type: "kanji",
          level: "N5",
          reading: "ガク・まな-ぶ",
          gloss: "apprendre, étudier ; le savoir, les études",
          readings: [
            { k: "音", v: "ガク (gaku)" },
            { k: "訓", v: "まな.ぶ (manabu)" },
          ],
          sens: {
            together:
              "<strong>学 (ガク／まなぶ)</strong> exprime l'idée d'« apprendre, étudier ». On le retrouve partout : 学生 (がくせい, étudiant), 学校 (がっこう, école), 大学 (だいがく, université), 学ぶ (まなぶ, apprendre).",
            parts: [
              { g: "⺍", r: "—", m: "trois petits traits en haut : des mains qui transmettent un savoir." },
              { g: "冖", r: "—", m: "un toit, une couverture." },
              { g: "子", r: "こ (ko)", m: "l'enfant — la clé « enfant »." },
            ],
          },
          decomp:
            "学 est la forme moderne abrégée de 學. On y reconnaît des mains qui transmettent (en haut), un toit 冖, et l'enfant 子 en dessous : le lieu où l'on transmet le savoir à l'enfant.",
          keys: [
            { g: "子", n: "clé « enfant » (部首 39)" },
            { g: "冖", n: "toit / couverture" },
          ],
          mnemo:
            "Sous un toit (冖), un enfant (子) reçoit le savoir qu'on lui transmet par-dessus (⺍) : c'est l'endroit où l'on apprend.",
          origin:
            "À l'origine 學 : deux mains transmettant un savoir à un enfant abrité dans un bâtiment. La forme moderne 学 en est la version abrégée.",
          examples: [
            {
              jp: "私は日本語を学んでいます。",
              yomi: "わたしは にほんごを まなんで います。",
              fr: "J'apprends le japonais.",
            },
            {
              jp: "妹は今年、大学に入りました。",
              yomi: "いもうとは ことし、だいがくに はいりました。",
              fr: "Ma petite sœur est entrée à l'université cette année.",
            },
          ],
          confuse: [
            {
              g: "字",
              n: "じ (ji)",
              d: "« caractère, lettre » : un signe écrit isolé (漢字). 学 = apprendre ; 字 = le caractère lui-même. Graphies proches (子 en bas).",
            },
            {
              g: "覚",
              n: "おぼえる (oboeru)",
              d: "« mémoriser, retenir » : l'action de fixer en mémoire, à distinguer de 学ぶ (acquérir un savoir dans la durée).",
            },
          ],
          usage:
            "Registre neutre. Le verbe 学ぶ (まなぶ) insiste sur l'acquisition d'un savoir dans la durée ; au quotidien, on emploie très souvent 勉強する (べんきょうする) pour « étudier ». En composés, 学 se lit ガク : 学生, 科学 (かがく, science).",
          patterns: {
            title: "Mots & expressions courants",
            label: "学 apparaît dans de nombreux mots — voici les plus utiles",
            rows: [
              ["étudiant, élève", "学生（がくせい）"],
              ["école", "学校（がっこう）"],
              ["université", "大学（だいがく）"],
              ["apprendre", "学ぶ（まなぶ）"],
              ["science", "科学（かがく）"],
              ["mathématiques", "数学（すうがく）"],
            ],
          },
        },
      },
      {
        slug: "fiche-vocabulaire-manabu",
        title: "Fiche de vocabulaire — 学ぶ (apprendre) · verbe",
        summary:
          "Exemple de fiche pour un verbe : la nature du mot (verbe du 1er groupe / godan) et sa conjugation sont mises en avant, en plus du sens et des exemples.",
        tags: ["vocabulaire", "verbe", "N5"],
        vocabFiche: {
          lemma: "学ぶ",
          type: "verbe",
          level: "N5",
          reading: "まなぶ (manabu)",
          gloss: "apprendre, étudier (acquérir un savoir, une compétence)",
          traits: [
            { k: "Nature", v: "Verbe" },
            { k: "Groupe", v: "1er groupe (godan / 五段) — radical en -b, se termine par ぶ" },
            { k: "Transitivité", v: "Transitif — l'objet est marqué par を (日本語を学ぶ)" },
          ],
          sens: {
            together:
              "<strong>学ぶ (まなぶ)</strong> signifie « apprendre » au sens d'acquérir un savoir ou une compétence dans la durée. Il est bâti sur le kanji 学 (apprendre) suivi de la terminaison verbale ぶ.",
            parts: [
              { g: "学", r: "mana", m: "le radical — porte le sens « apprendre »." },
              { g: "ぶ", r: "bu", m: "terminaison d'un verbe du 1er groupe (godan)." },
            ],
          },
          conj: {
            group: "1er groupe (godan) — se conjugue comme 遊ぶ, 読む",
            rows: [
              ["Forme du dictionnaire", "学ぶ"],
              ["Forme polie (-ます)", "学びます"],
              ["Forme en て", "学んで"],
              ["Négatif neutre (-ない)", "学ばない"],
              ["Passé neutre (-た)", "学んだ"],
              ["Volitif (-よう)", "学ぼう"],
            ],
          },
          examples: [
            {
              jp: "大学で経済を学んでいます。",
              yomi: "だいがくで けいざいを まなんで います。",
              fr: "J'étudie l'économie à l'université.",
            },
            {
              jp: "失敗から多くのことを学んだ。",
              yomi: "しっぱいから おおくの ことを まなんだ。",
              fr: "J'ai beaucoup appris de mes échecs.",
            },
          ],
          confuseTitle: "Verbes proches",
          confuse: [
            {
              g: "習う",
              n: "ならう (narau)",
              d: "« apprendre par la pratique / auprès d'un maître » (piano, danse). 学ぶ est plus large et plus intellectuel ; 習う insiste sur l'entraînement guidé.",
            },
            {
              g: "教える",
              n: "おしえる (oshieru)",
              d: "« enseigner » — le verbe inverse : transmettre le savoir plutôt que l'acquérir.",
            },
          ],
          usage:
            "Verbe du 1er groupe (godan) : c'est l'information clé pour le conjuguer (toutes les formes ci-dessus en découlent). 学ぶ est un peu soutenu ; au quotidien on dit souvent 勉強する.",
        },
      },
      {
        slug: "fiche-vocabulaire-nomimono",
        title: "Fiche de vocabulaire — 飲み物 (boisson) · nom composé",
        summary:
          "Exemple de fiche pour un nom composé : on met en avant sa formation (verbe à la base en -ます + 物), un schéma très productif en japonais.",
        tags: ["vocabulaire", "nom", "N5"],
        vocabFiche: {
          lemma: "飲み物",
          type: "mot",
          level: "N5",
          reading: "のみもの (nomimono)",
          gloss: "boisson, quelque chose à boire",
          traits: [
            { k: "Nature", v: "Nom (nom composé)" },
            { k: "Formation", v: "飲み (base en -ます de 飲む « boire ») + 物 (もの, chose)" },
            { k: "Schéma productif", v: "Verbe (base -ます) + 物 → « une chose que l'on … »" },
            { k: "Même famille", v: "食べ物 (nourriture), 読み物 (lecture), 乗り物 (véhicule)" },
          ],
          sens: {
            together:
              "<strong>飲み物 (のみもの)</strong> désigne « une boisson », littéralement « une chose à boire ». Il se forme sur le verbe 飲む (のむ, boire).",
            parts: [
              { g: "飲み", r: "nomi", m: "base en -ます (連用形) du verbe 飲む « boire »." },
              { g: "物", r: "mono", m: "« chose, objet » — nominalise le verbe." },
            ],
          },
          mnemo:
            "Prends la base en -ます d'un verbe et ajoute 物 : 飲む → 飲み + 物 = « chose à boire ». Le même moule donne 食べる → 食べ物 (nourriture).",
          examples: [
            {
              jp: "温かい飲み物はいかがですか。",
              yomi: "あたたかい のみものは いかがですか。",
              fr: "Voulez-vous une boisson chaude ?",
            },
            {
              jp: "自動販売機で飲み物を買いました。",
              yomi: "じどうはんばいきで のみものを かいました。",
              fr: "J'ai acheté une boisson au distributeur automatique.",
            },
          ],
          confuseTitle: "Mots de la même famille",
          confuse: [
            {
              g: "食べ物",
              n: "たべもの (tabemono)",
              d: "« nourriture, quelque chose à manger » : même schéma (食べる → 食べ + 物). 飲み物 = à boire ; 食べ物 = à manger.",
            },
            {
              g: "乗り物",
              n: "のりもの (norimono)",
              d: "« véhicule » : encore le même moule (乗る → 乗り + 物). Reconnaître ce schéma aide à décoder beaucoup de noms.",
            },
          ],
          usage:
            "Nom courant et neutre. Sa valeur pédagogique : comprendre le schéma « base en -ます + 物 », très productif (食べ物, 読み物, 乗り物, 忘れ物…). Une fois le moule compris, on décode et forme facilement ces mots.",
        },
      },
      {
        slug: "fiche-vocabulaire-koohii",
        title: "Fiche de vocabulaire — コーヒー (café) · mot en kana",
        summary:
          "Exemple de fiche pour un mot écrit uniquement en kana : pas de décomposition de caractère, mais l'écriture (katakana), l'origine (mot emprunté) et la prononciation sont mises en avant.",
        tags: ["vocabulaire", "katakana", "N5"],
        vocabFiche: {
          lemma: "コーヒー",
          type: "mot",
          level: "N5",
          reading: "kōhī",
          gloss: "café (la boisson)",
          traits: [
            { k: "Nature", v: "Nom — mot emprunté (外来語 / gairaigo)" },
            { k: "Écriture", v: "Katakana uniquement — aucun kanji" },
            { k: "Origine", v: "Du néerlandais « koffie » / anglais « coffee »" },
            { k: "Prononciation", v: "Voyelles longues notées par ー : ko-o-hi-i" },
          ],
          sens: {
            together:
              "<strong>コーヒー (kōhī)</strong> désigne le « café » (la boisson). C'est un 外来語 (mot emprunté aux langues européennes), donc écrit en katakana, sans kanji.",
          },
          origin:
            "外来語 (gairaigo) : mot importé, transcrit phonétiquement en katakana — l'écriture réservée aux emprunts, onomatopées et mots mis en relief. L'allongement vocalique se marque par ー.",
          examples: [
            {
              jp: "毎朝、コーヒーを飲みます。",
              yomi: "まいあさ、コーヒーを のみます。",
              fr: "Je bois du café tous les matins.",
            },
            {
              jp: "ホットコーヒーを一つください。",
              yomi: "ホットコーヒーを ひとつ ください。",
              fr: "Un café chaud, s'il vous plaît.",
            },
          ],
          confuse: [
            {
              g: "コーラ",
              n: "kōra",
              d: "« cola » : autre boisson en katakana. Attention à ne pas confondre les emprunts proches à l'oral.",
            },
            {
              g: "お茶",
              n: "おちゃ (ocha)",
              d: "« thé » : mot japonais d'origine, écrit avec un kanji — contraste avec l'emprunt コーヒー.",
            },
          ],
          usage:
            "Mot en katakana : la clé pour l'apprendre est l'écriture et les voyelles longues (ー), pas une décomposition de caractère. Beaucoup de boissons sont des emprunts en katakana (ジュース, ビール, ワイン…).",
        },
      },
    ],
  },
];

/** Toutes les leçons, à plat (tous groupes confondus). */
export const VRAC_LESSONS: VracLesson[] = VRAC_GROUPS.flatMap((g) => g.lessons);

export function getVracLesson(slug: string): VracLesson | undefined {
  return VRAC_LESSONS.find((l) => l.slug === slug);
}

/** Turns a YouTube URL (watch / youtu.be / embed) into an embeddable URL, or null. */
export function toEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const yt = trimmed.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return trimmed;
}
