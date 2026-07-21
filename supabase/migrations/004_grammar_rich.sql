-- =====================================================================
-- 004 — Grammaire enrichie (« fiche » de type leçon, comme le vocab)
-- Ajoute une colonne JSONB `content` à grammar_points pour héberger
-- une leçon détaillée (formation par groupe, emboîtement, comparaisons,
-- erreurs à éviter, nuances…), puis insère la leçon d'exemple
-- « 〜ないでください » (demande négative polie, N5).
-- Idempotent : ré-exécutable (add column if not exists / upsert par slug).
-- =====================================================================

alter table grammar_points add column if not exists content jsonb;

-- ---------- Leçon d'exemple : 〜ないでください (conjugaison, N5) ----------
insert into grammar_points (slug, level, lemma, gloss, detail, content, position) values
(
  $q$g-naide-kudasai$q$,
  'N5',
  $q$〜ないでください$q$,
  $q$« S'il vous plaît, ne faites pas… » — demander poliment de ne pas faire une action.$q$,
  $q$Forme négative neutre en ない + でください. Le verbe ne se met jamais en ～ません devant cette formule.$q$,
  $json${
    "formula": "V-ないでください",
    "intro": "La structure ～ないでください sert à demander poliment à quelqu'un de ne pas faire quelque chose. Elle correspond à « s'il vous plaît, ne… pas » ou « veuillez ne pas… ». On l'emploie pour une consigne, un avertissement, un conseil ou pour demander l'arrêt d'un comportement.",
    "formation": {
      "intro": "On part du négatif neutre en ない, puis on ajoute でください. Le verbe ne se met donc jamais en ～ません devant cette formule.",
      "rows": [
        {"group": "Groupe 1", "verb": "書く (kaku)", "form": "書かないでください", "meaning": "N'écrivez pas, s'il vous plaît."},
        {"group": "Groupe 1", "verb": "買う (kau)", "form": "買わないでください", "meaning": "N'achetez pas, s'il vous plaît."},
        {"group": "Groupe 2", "verb": "食べる (taberu)", "form": "食べないでください", "meaning": "Ne mangez pas, s'il vous plaît."},
        {"group": "Groupe 2", "verb": "見る (miru)", "form": "見ないでください", "meaning": "Ne regardez pas, s'il vous plaît."},
        {"group": "Irrégulier", "verb": "する (suru)", "form": "しないでください", "meaning": "Ne faites pas, s'il vous plaît."},
        {"group": "Irrégulier", "verb": "来る (kuru)", "form": "来ないでください", "meaning": "Ne venez pas, s'il vous plaît."}
      ]
    },
    "rules": [
      {"label": "Groupe 1", "text": "La dernière syllabe passe sur la ligne en -a, puis on ajoute ないでください. Les verbes en う utilisent わ : 買う → 買わないでください."},
      {"label": "Groupe 2", "text": "On retire る, puis on ajoute ないでください : 食べる → 食べないでください."},
      {"label": "Irréguliers", "text": "する → しないでください ; 来る → 来ないでください（こないでください）."}
    ],
    "breakdown": {
      "steps": [
        {"jp": "読む", "romaji": "yomu", "fr": "lire"},
        {"jp": "読ま", "romaji": "yoma", "fr": "base négative"},
        {"jp": "読まない", "romaji": "yomanai", "fr": "ne pas lire"},
        {"jp": "読まないで", "romaji": "yomanaide", "fr": "ne lis pas / sans lire"},
        {"jp": "読まないでください", "romaji": "yomanaide kudasai", "fr": "veuillez ne pas lire"}
      ]
    },
    "note": "Même si l'ensemble est poli grâce à ください, le verbe qui précède reste au négatif neutre en ない : 飲まないでください, et non 飲みませんでください.",
    "compare": [
      {"type": "aff", "jp": "ここに入ってください。", "fr": "Entrez ici, s'il vous plaît."},
      {"type": "neg", "jp": "ここに入らないでください。", "fr": "N'entrez pas ici, s'il vous plaît."},
      {"type": "aff", "jp": "写真を撮ってください。", "fr": "Prenez une photo, s'il vous plaît."},
      {"type": "neg", "jp": "写真を撮らないでください。", "fr": "Ne prenez pas de photo, s'il vous plaît."}
    ],
    "examples": [
      {"jp": "ここでたばこを吸わないでください。", "fr": "Ne fumez pas ici, s'il vous plaît."},
      {"jp": "危ないですから、触らないでください。", "fr": "C'est dangereux, alors n'y touchez pas."},
      {"jp": "この薬を飲んだあと、運転しないでください。", "fr": "Après avoir pris ce médicament, ne conduisez pas."},
      {"jp": "心配しないでください。", "fr": "Ne vous inquiétez pas."}
    ],
    "softener": {
      "text": "L'ajout de ね à la fin adoucit la demande : elle se présente comme un conseil ou une précaution partagée, plutôt que comme une interdiction sèche.",
      "example": {"jp": "無理をしないでくださいね。", "fr": "Ne forcez pas trop, d'accord ? / Prenez soin de vous."}
    },
    "mistakes": [
      {"ok": false, "form": "食べませんでください", "note": "La politesse ne se construit pas avec ～ません devant でください."},
      {"ok": false, "form": "食べないください", "note": "Il manque で entre la forme négative et ください."},
      {"ok": false, "form": "食べなくてください", "note": "Pour cette demande négative on utilise ～ないで, et non ～なくて."},
      {"ok": true, "form": "食べないでください", "note": "Forme correcte : négatif en ～ない + でください."}
    ],
    "without": "Sans ください, ～ないで forme une demande familière ou émotionnelle : 泣かないで « ne pleure pas ». Devant une autre action, la même forme signifie « sans faire » : 朝ご飯を食べないで学校へ行きました « je suis allé à l'école sans prendre de petit-déjeuner ».",
    "summary": "Pour demander poliment de ne pas faire une action : forme négative en ない + でください. La structure complète se mémorise comme un seul bloc : V-ないでください.",
    "sources": [
      "Japan Foundation — Irodori, notes grammaticales et exercices",
      "Japan Foundation — Marugoto, points pédagogiques du niveau élémentaire"
    ]
  }$json$::jsonb,
  10
)
on conflict (slug) do update set
  level = excluded.level,
  lemma = excluded.lemma,
  gloss = excluded.gloss,
  detail = excluded.detail,
  content = excluded.content,
  position = excluded.position;

-- ---------- Questions de pratique ----------
insert into grammar_questions (grammar_id, direction, prompt, answer, position)
select g.id, x.dir::question_direction, x.prompt, x.answer, x.pos
from grammar_points g
join (values
  ($q$g-naide-kudasai$q$, 'FR_JP', $q$Ne fumez pas ici, s'il vous plaît.$q$, $q$ここでたばこを吸わないでください。$q$, 1),
  ($q$g-naide-kudasai$q$, 'FR_JP', $q$Ne mangez pas, s'il vous plaît.$q$, $q$食べないでください。$q$, 2),
  ($q$g-naide-kudasai$q$, 'FR_JP', $q$Ne venez pas.$q$, $q$来ないでください。$q$, 3),
  ($q$g-naide-kudasai$q$, 'JP_FR', $q$写真を撮らないでください。$q$, $q$Ne prenez pas de photo, s'il vous plaît.$q$, 4),
  ($q$g-naide-kudasai$q$, 'JP_FR', $q$心配しないでください。$q$, $q$Ne vous inquiétez pas.$q$, 5)
) as x(slug, dir, prompt, answer, pos) on x.slug = g.slug
where not exists (
  select 1 from grammar_questions q where q.grammar_id = g.id and q.prompt = x.prompt
);
