"use client";

import { useState, type ReactNode } from "react";
import { getVracLesson, type VracSection } from "@/lib/vrac";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { CourseSections } from "./CourseSections";
import { VocabFiche, type VocabFicheData } from "./VocabFiche";
import { DetailDrawer } from "./DetailDrawer";
import { Flashcards, type FlashcardItem } from "./Flashcards";
import { LessonExercise } from "./LessonExercise";
import { JpText } from "./JpText";
import { AnswerCard } from "./AnswerCard";

// ---- Contenu d'exemple (le contenu réel viendra ensuite) ----
const RICH = ["fiche-vocabulaire-gaku", "fiche-vocabulaire-manabu", "fiche-vocabulaire-nomimono", "fiche-vocabulaire-koohii"]
  .map((s) => getVracLesson(s)?.vocabFiche)
  .filter((f): f is NonNullable<typeof f> => Boolean(f));

const basic = (lemma: string, type: string, reading: string, gloss: string): VocabFicheData => ({ lemma, type, level: "N5", reading, gloss });

const LESSON_VOCAB: VocabFicheData[] = [
  ...RICH,
  basic("私", "mot", "わたし", "je, moi"),
  basic("学生", "mot", "がくせい", "étudiant"),
  basic("先生", "mot", "せんせい", "professeur"),
  basic("本", "kanji", "ほん", "livre"),
  basic("水", "kanji", "みず", "eau"),
  basic("毎朝", "mot", "まいあさ", "chaque matin"),
  basic("飲む", "verbe", "のむ", "boire"),
  basic("静か", "adjectif", "しずか", "calme"),
  basic("便利", "adjectif", "べんり", "pratique"),
  basic("新聞", "mot", "しんぶん", "journal"),
];

const VOCAB_FLASH: FlashcardItem[] = [
  { id: "lm-1", front: "学", sub: "ガク・まなぶ", back: "apprendre, étudier — caractère" },
  { id: "lm-2", front: "学生", sub: "がくせい", back: "étudiant" },
  { id: "lm-3", front: "先生", sub: "せんせい", back: "professeur" },
  { id: "lm-4", front: "水", sub: "みず", back: "eau" },
  { id: "lm-5", front: "飲む", sub: "のむ", back: "boire — verbe" },
  { id: "lm-6", front: "飲み物", sub: "のみもの", back: "boisson — nom composé" },
  { id: "lm-7", front: "コーヒー", sub: "kōhī", back: "café — mot en katakana" },
  { id: "lm-8", front: "静か", sub: "しずか", back: "calme — adjectif en な" },
];

const GRAMMAR = getVracLesson("la-copule-neutre-et-polie");
const CONJ = getVracLesson("la-demande-negative-naide-kudasai");

const HA_SECTIONS: VracSection[] = [
  {
    heading: "La particule は — le thème",
    paragraphs: [
      "は marque le thème de la phrase : ce dont on parle. Elle se place juste après le mot-thème.",
      "Attention : quand elle est particule, は se prononce « wa » (et non « ha »).",
    ],
    callout: "Exemple — 私は学生です。 « Moi, je suis étudiant. »",
  },
  { heading: "は et が", paragraphs: ["は présente le thème (souvent connu) ; が marque le sujet (souvent nouveau). La distinction s'affine avec la pratique."] },
];

const MASU_SECTIONS: VracSection[] = [
  {
    heading: "La forme polie en 〜ます",
    paragraphs: [
      "La forme en 〜ます est la forme polie standard du présent, employée par défaut avec les personnes qu'on ne connaît pas.",
      "On la construit sur la base en -i (godan) ou en retirant る (ichidan), puis on ajoute ます.",
    ],
    callout: "Exemple — 飲む → 飲みます ; 食べる → 食べます.",
  },
];

interface PointItem { title: string; desc: string; sections: VracSection[]; }
const GRAMMAR_LIST: PointItem[] = [
  { title: "La copule — N・A-na + だ・です", desc: "Identifier, classer ou décrire avec un nom ou un adjectif en な.", sections: GRAMMAR?.sections ?? [] },
  { title: "La particule は — le thème", desc: "Marquer ce dont on parle dans la phrase.", sections: HA_SECTIONS },
];
const CONJ_LIST: PointItem[] = [
  { title: "La demande négative — 〜ないでください", desc: "Demander poliment de ne pas faire quelque chose.", sections: CONJ?.sections ?? [] },
  { title: "La forme polie — 〜ます", desc: "La forme polie standard du présent.", sections: MASU_SECTIONS },
];

// ---- Squelettes de la partie 2 (données fictives, pour visualiser la mise en page) ----
// Texte de compréhension écrite, tokenisé pour le dictionnaire (survol / toucher).
const READING_TOKENS = [
  { w: "私", reading: "わたし・watashi", pos: "pronom", meaning: "je, moi" },
  { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
  { w: "毎朝", reading: "まいあさ・maiasa", pos: "nom / adverbe", meaning: "chaque matin" },
  { w: "、", plain: true },
  { w: "コーヒー", reading: "kōhī", pos: "nom", meaning: "café" },
  { w: "を", reading: "o", pos: "particule", meaning: "complément d'objet direct" },
  { w: "飲みます", reading: "のみます・nomimasu", pos: "verbe (poli)", meaning: "boire (de 飲む)" },
  { w: "。", plain: true },
  { w: "それから", reading: "sorekara", pos: "conjonction", meaning: "ensuite, puis" },
  { w: "、", plain: true },
  { w: "電車", reading: "でんしゃ・densha", pos: "nom", meaning: "train" },
  { w: "で", reading: "de", pos: "particule", meaning: "moyen (en, par)" },
  { w: "学校", reading: "がっこう・gakkō", pos: "nom", meaning: "école" },
  { w: "へ", reading: "e", pos: "particule", meaning: "direction (vers)" },
  { w: "行きます", reading: "いきます・ikimasu", pos: "verbe (poli)", meaning: "aller (de 行く)" },
  { w: "。", plain: true },
  { w: "学校", reading: "がっこう・gakkō", pos: "nom", meaning: "école" },
  { w: "で", reading: "de", pos: "particule", meaning: "lieu de l'action" },
  { w: "日本語", reading: "にほんご・nihongo", pos: "nom", meaning: "japonais (la langue)" },
  { w: "を", reading: "o", pos: "particule", meaning: "complément d'objet direct" },
  { w: "勉強します", reading: "べんきょうします・benkyō shimasu", pos: "verbe (poli)", meaning: "étudier" },
  { w: "。", plain: true },
  { w: "日本語", reading: "にほんご・nihongo", pos: "nom", meaning: "japonais (la langue)" },
  { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
  { w: "とても", reading: "totemo", pos: "adverbe", meaning: "très" },
  { w: "面白い", reading: "おもしろい・omoshiroi", pos: "adjectif en い", meaning: "intéressant" },
  { w: "です", reading: "desu", pos: "copule", meaning: "être (fermeture polie)" },
  { w: "が", reading: "ga", pos: "particule", meaning: "mais (opposition)" },
  { w: "、", plain: true },
  { w: "漢字", reading: "かんじ・kanji", pos: "nom", meaning: "kanji, caractères chinois" },
  { w: "は", reading: "wa", pos: "particule", meaning: "marque le thème de la phrase" },
  { w: "少し", reading: "すこし・sukoshi", pos: "adverbe", meaning: "un peu" },
  { w: "難しい", reading: "むずかしい・muzukashii", pos: "adjectif en い", meaning: "difficile" },
  { w: "です", reading: "desu", pos: "copule", meaning: "être (fermeture polie)" },
  { w: "。", plain: true },
];
const READING_Q = [
  { prompt: "「私」は毎朝、何を飲みますか。", answer: "コーヒーを飲みます。" },
  { prompt: "どうやって学校へ行きますか。", answer: "電車で行きます。" },
  { prompt: "学校で何を勉強しますか。", answer: "日本語を勉強します。" },
  { prompt: "「私」にとって、何が少し難しいですか。", answer: "漢字が少し難しいです。" },
];
// Dialogue tokenisé pour le dictionnaire.
const DIALOGUE = [
  { who: "店員", fr: "Bienvenue. Que désirez-vous ?", tokens: [
    { w: "いらっしゃいませ", reading: "irasshaimase", pos: "expression", meaning: "bienvenue (accueil d'un commerce)" },
    { w: "。", plain: true },
    { w: "何", reading: "なに・nani", pos: "pronom", meaning: "quoi, que" },
    { w: "を", reading: "o", pos: "particule", meaning: "complément d'objet direct" },
    { w: "召し上がりますか", reading: "めしあがりますか・meshiagarimasu ka", pos: "verbe honorifique + か", meaning: "manger / boire (honorifique), question" },
    { w: "。", plain: true },
  ] },
  { who: "客", fr: "Un café, s'il vous plaît.", tokens: [
    { w: "コーヒー", reading: "kōhī", pos: "nom", meaning: "café" },
    { w: "を", reading: "o", pos: "particule", meaning: "complément d'objet direct" },
    { w: "一つ", reading: "ひとつ・hitotsu", pos: "compteur", meaning: "un (objet)" },
    { w: "、", plain: true },
    { w: "お願いします", reading: "おねがいします・onegai shimasu", pos: "expression", meaning: "s'il vous plaît" },
    { w: "。", plain: true },
  ] },
  { who: "店員", fr: "Entendu, un instant je vous prie.", tokens: [
    { w: "かしこまりました", reading: "kashikomarimashita", pos: "expression", meaning: "entendu (très poli)" },
    { w: "。", plain: true },
    { w: "少々", reading: "しょうしょう・shōshō", pos: "adverbe", meaning: "un instant, un peu" },
    { w: "お待ちください", reading: "おまちください・omachi kudasai", pos: "expression", meaning: "veuillez patienter" },
    { w: "。", plain: true },
  ] },
  { who: "客", fr: "Merci beaucoup.", tokens: [
    { w: "ありがとうございます", reading: "arigatō gozaimasu", pos: "expression", meaning: "merci beaucoup" },
    { w: "。", plain: true },
  ] },
];
const DIALOGUE_Q = [
  { prompt: "客は何を注文しましたか。", answer: "コーヒーを一つ注文しました。" },
  { prompt: "店員は待つとき、何と言いましたか。", answer: "「少々お待ちください」と言いました。" },
];

type StepKey = "vocab" | "grammar" | "conj" | "lecture" | "ecoute" | "redaction" | "oral";
const STEPS: { key: StepKey; part: 1 | 2; icon: string; title: string; sub: string }[] = [
  { key: "vocab", part: 1, icon: "🧠", title: "Vocabulaire", sub: "Apprends les mots, puis valide en flashcards." },
  { key: "grammar", part: 1, icon: "🧩", title: "Grammaire", sub: "Étudie les points, puis valide (10 + 10 questions)." },
  { key: "conj", part: 1, icon: "🔄", title: "Conjugaison", sub: "Étudie les règles, puis valide (10 + 10 questions)." },
  { key: "lecture", part: 2, icon: "📖", title: "Compréhension écrite", sub: "Un texte, puis des questions." },
  { key: "ecoute", part: 2, icon: "🎧", title: "Compréhension orale", sub: "Un dialogue audio, puis des questions." },
  { key: "redaction", part: 2, icon: "✍️", title: "Expression écrite", sub: "Un sujet à rédiger, corrigé par l'IA." },
  { key: "oral", part: 2, icon: "🎤", title: "Expression orale", sub: "Un sujet à l'oral, corrigé par l'IA." },
];
const P1: StepKey[] = ["vocab", "grammar", "conj"];

export function LessonModel() {
  const [route, setRoute] = useState<"map" | StepKey>("map");
  const [sub, setSub] = useState<"content" | "validate">("content");
  const [done, setDone] = useState<Set<StepKey>>(new Set());
  const [detail, setDetail] = useState<{ title?: string; node: ReactNode } | null>(null);

  const p1DoneCount = P1.filter((k) => done.has(k)).length;

  function toTop() { if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }
  function enter(k: StepKey) { setRoute(k); setSub("content"); toTop(); }
  function backToMap() { setRoute("map"); setDetail(null); toTop(); }
  function finishStep(k: StepKey) { setDone((d) => new Set(d).add(k)); backToMap(); }

  // Ordre libre : les modules de la partie 1 se font dans l'ordre voulu.
  function statusOf(step: (typeof STEPS)[number]) {
    if (step.part === 2) return "construction" as const;
    if (done.has(step.key)) return "done" as const;
    return "available" as const;
  }

  // -------- Listes réutilisées dans les étapes de la partie 1 --------
  const VocabList = (
    <ul className="vlist">
      {LESSON_VOCAB.map((f, i) => (
        <li key={i} className="vrow" onClick={() => setDetail({ node: <VocabFiche item={f} /> })}>
          <span className="vglyph">{f.lemma}</span>
          <span className="vreading">{f.reading ?? ""}</span>
          <span className="vgloss">{f.gloss}</span>
          <span className="vtags"><span className="vtype">{VOCAB_TYPE_LABELS[f.type] ?? f.type}</span></span>
        </li>
      ))}
    </ul>
  );
  const pointList = (items: PointItem[]) => (
    <ul className="lm-plist">
      {items.map((p, i) => (
        <li key={i} className="lm-prow" onClick={() => setDetail({ title: p.title, node: <CourseSections sections={p.sections} /> })}>
          <span className="lm-prow-main"><span className="lm-prow-title">{p.title}</span><span className="lm-prow-desc">{p.desc}</span></span>
          <span className="lm-prow-ar" aria-hidden>›</span>
        </li>
      ))}
    </ul>
  );

  // ======================= ROADMAP =======================
  if (route === "map") {
    return (
      <div className="rm">
        <div className="rm-part">
          <div className="rm-part-head">
            <span className="rm-part-eyebrow">Partie 1</span>
            <h2 className="rm-part-title">Apprentissage</h2>
          </div>
          <span className={`rm-part-prog ${p1DoneCount === 3 ? "is-done" : ""}`}>
            {p1DoneCount === 3 ? "Terminé ✓" : `${p1DoneCount} / 3`}
          </span>
        </div>
        <div className="rm-progress"><i style={{ width: `${(p1DoneCount / 3) * 100}%` }} /></div>
        <ol className="rm-steps">{STEPS.filter((s) => s.part === 1).map(renderStep)}</ol>

        {p1DoneCount === 3 && (
          <div className="rm-note">🎉 Partie 1 validée ! La partie 2 arrivera bientôt.</div>
        )}

        <div className="rm-part">
          <div className="rm-part-head">
            <span className="rm-part-eyebrow">Partie 2</span>
            <h2 className="rm-part-title">Exercices</h2>
          </div>
          <span className="rm-soon">En construction</span>
        </div>
        <ol className="rm-steps">{STEPS.filter((s) => s.part === 2).map(renderStep)}</ol>

        <DetailDrawer open={detail !== null} title={detail?.title} onClose={() => setDetail(null)}>
          {detail?.node}
        </DetailDrawer>
      </div>
    );
  }

  function renderStep(step: (typeof STEPS)[number]) {
    const st = statusOf(step);
    const statusLabel = { done: "Validé", available: "À faire", construction: "En construction" }[st];
    const nodeGlyph = st === "done" ? "✓" : st === "construction" ? "🔒" : step.icon;
    return (
      <li key={step.key} className={`rm-step ${st}`}>
        <div className="rm-node" aria-hidden>{nodeGlyph}</div>
        <div className="rm-card">
          <div className="rm-card-top">
            <h3>{step.title}</h3>
            <span className={`rm-status s-${st}`}>{statusLabel}</span>
          </div>
          <p>{step.sub}</p>
          <div className="rm-actions">
            {st === "available" && <button className="btn primary" onClick={() => enter(step.key)}>Commencer →</button>}
            {st === "done" && <button className="btn ghost" onClick={() => enter(step.key)}>Refaire</button>}
            {st === "construction" && <button className="btn ghost" onClick={() => enter(step.key)}>Aperçu →</button>}
          </div>
        </div>
      </li>
    );
  }

  // ======================= ÉTAPE OUVERTE =======================
  const step = STEPS.find((s) => s.key === route)!;

  // ---- Partie 1 : apprendre puis valider ----
  if (step.part === 1) {
    const list = step.key === "vocab" ? VocabList : step.key === "grammar" ? pointList(GRAMMAR_LIST) : pointList(CONJ_LIST);
    const validateLabel = step.key === "vocab" ? "Valider le vocabulaire" : step.key === "grammar" ? "Valider la grammaire" : "Valider la conjugaison";
    const listIntro = step.key === "vocab" ? "Les mots de la leçon. Touche un mot pour ouvrir sa fiche."
      : step.key === "grammar" ? "Les points de grammaire. Touche un point pour lire le cours."
      : "Les règles de conjugaison. Touche une règle pour lire le cours.";
    const validation = step.key === "vocab" ? <Flashcards kind="vocab" items={VOCAB_FLASH} />
      : step.key === "grammar" ? (GRAMMAR?.exercise ? <LessonExercise items={GRAMMAR.exercise.items} /> : null)
      : (CONJ?.exercise ? <LessonExercise items={CONJ.exercise.items} /> : null);
    const validateIntro = step.key === "vocab" ? "Révise les mots en flashcards, puis auto-évalue-toi."
      : "Traduis dans les deux sens : 10 japonais → français et 10 français → japonais.";

    return (
      <div className="lm-step">
        <button className="lm-back" onClick={backToMap}>← Feuille de route</button>
        <div className="lm-panel-head"><span className="lm-panel-ic" aria-hidden>{step.icon}</span><h2>{step.title}{sub === "validate" ? " · validation" : ""}</h2></div>

        {sub === "content" ? (
          <>
            <p className="lm-intro">{listIntro}</p>
            {list}
            <button className="btn primary lm-validate" onClick={() => { setSub("validate"); toTop(); }}>{validateLabel} →</button>
          </>
        ) : (
          <>
            <button className="lm-back" onClick={() => setSub("content")}>← Revoir la liste</button>
            <p className="lm-intro">{validateIntro}</p>
            {step.key === "vocab" ? <div className="lm-flash">{validation}</div> : validation}
            <button className="btn primary lm-validate" onClick={() => finishStep(step.key)}>Terminer &amp; valider ✓</button>
          </>
        )}

        <DetailDrawer open={detail !== null} title={detail?.title} onClose={() => setDetail(null)}>
          {detail?.node}
        </DetailDrawer>
      </div>
    );
  }

  // ---- Partie 2 : squelettes (en construction) ----
  return (
    <div className="lm-step">
      <button className="lm-back" onClick={backToMap}>← Feuille de route</button>
      <div className="lm-constr-banner">🔒 En construction — aperçu de la mise en page. Le contenu est fictif ; les données réelles et l&apos;IA viendront ensuite.</div>
      <div className="lm-panel-head"><span className="lm-panel-ic" aria-hidden>{step.icon}</span><h2>{step.title}</h2></div>

      {step.key === "lecture" && (
        <>
          <div className="course-body"><section className="course-section"><h2>Texte</h2>
            <div className="jp-sentence-card"><JpText tokens={READING_TOKENS} size="sm" /></div>
            <p className="lm-dico-hint"><span aria-hidden>💡</span> Survole (ou touche) un mot pour voir sa définition.</p>
          </section></div>
          <div className="lm-subh">Questions de compréhension</div>
          {READING_Q.map((q, i) => <AnswerCard key={i} prompt={q.prompt} answer={q.answer} />)}
        </>
      )}

      {step.key === "ecoute" && (
        <>
          <div className="audio-card lm-audio">
            <div className="audio-glyph" aria-hidden>🎧</div>
            <div className="audio-main">
              <div className="audio-title">Écoute du dialogue</div>
              <div className="audio-wave" aria-hidden>{Array.from({ length: 28 }).map((_, i) => <span key={i} style={{ height: `${18 + ((i * 7) % 26)}px` }} />)}</div>
              <div className="audio-hint">Lecteur audio — à brancher avec l&apos;enregistrement.</div>
            </div>
          </div>
          <div className="lm-subh">Transcription</div>
          <div className="course-body"><div className="dlg">{DIALOGUE.map((l, i) => (
            <div key={i} className="dlg-line"><span className="dlg-who">{l.who}</span><span><JpText tokens={l.tokens} size="sm" /><br /><span className="dlg-fr">{l.fr}</span></span></div>
          ))}</div></div>
          <p className="lm-dico-hint"><span aria-hidden>💡</span> Survole (ou touche) un mot pour voir sa définition.</p>
          <div className="lm-subh">Questions de compréhension</div>
          {DIALOGUE_Q.map((q, i) => <AnswerCard key={i} prompt={q.prompt} answer={q.answer} />)}
        </>
      )}

      {step.key === "redaction" && (
        <>
          <div className="lm-prompt"><div className="lm-prompt-label">Sujet</div><p>毎日の習慣について、3〜4文で書いてください。（例：私は毎朝コーヒーを飲みます。）</p></div>
          <textarea className="ex-input" rows={5} placeholder="Écris ta réponse en japonais…" disabled />
          <div className="lm-nav" style={{ justifyContent: "flex-start" }}><button className="btn primary" disabled>✨ Faire ma correction personnalisée</button></div>
          <div className="lm-aifeedback">La correction de l&apos;IA s&apos;affichera ici : grammaire, choix de vocabulaire et naturel de la phrase.</div>
        </>
      )}

      {step.key === "oral" && (
        <>
          <div className="lm-prompt"><div className="lm-prompt-label">Sujet</div><p>自己紹介をしてください。名前、仕事、好きなものを話しましょう。</p></div>
          <div className="lm-record"><button className="lm-mic" disabled aria-hidden>🎤</button><span>Appuie pour enregistrer ta réponse à l&apos;oral.</span></div>
          <div className="lm-nav" style={{ justifyContent: "flex-start" }}><button className="btn primary" disabled>✨ Faire ma correction personnalisée</button></div>
          <div className="lm-aifeedback">L&apos;IA évaluera ta prononciation, ton intonation et ta grammaire, avec des conseils personnalisés.</div>
        </>
      )}
    </div>
  );
}
