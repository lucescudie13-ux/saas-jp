"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import type { CombinedLesson, CombinedModule } from "@/lib/curriculum";
import { TRACK_LABELS, TRACK_ICONS } from "@/lib/curriculum";
import type { GrammarRule } from "@/lib/grammar-content";
import type { ExItem } from "@/lib/exercise-content";
import type { Comprehension } from "@/lib/comprehension-content";
import type { VocabItemRow } from "@/types/database.types";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { Flashcards } from "./Flashcards";
import { FicheView, type FicheItem } from "./FicheView";
import { GrammarRuleView } from "./GrammarRuleView";
import { LessonExercise } from "./LessonExercise";
import { ComprehensionView } from "./ComprehensionView";
import { VerifyForm } from "@/components/forms/VerifyForm";
import { getValidated, setValidated } from "@/lib/lesson-progress";

type OpenView = (title: string, node: ReactNode) => void;

const PART2 = [
  { key: "comp-ecrite", icon: "📖", title: "Compréhension écrite", desc: "Un texte reprenant le vocabulaire de la leçon, suivi de questions." },
  { key: "comp-orale", icon: "🎧", title: "Compréhension orale", desc: "Un dialogue audio reprenant le contenu de la leçon, suivi de questions." },
  { key: "expr-ecrite", icon: "✍️", title: "Expression écrite", desc: "Un sujet à rédiger, avec correction personnalisée." },
  { key: "expr-orale", icon: "🎤", title: "Expression orale", desc: "Un sujet à l'oral, avec correction personnalisée." },
];

export function LessonRoadmap({ lesson, vocab, grammar, conjugation, grammarExercises, conjExercises, comprehension, nextHref }: {
  lesson: CombinedLesson;
  vocab: VocabItemRow[];
  grammar: GrammarRule[];
  conjugation: GrammarRule[];
  grammarExercises: ExItem[];
  conjExercises: ExItem[];
  comprehension: Comprehension | null;
  nextHref?: Route | null;
}) {
  // Pile de vues plein écran : leçon → contenu du module → détail (mot / règle).
  // Chaque ouverture empile une entrée d'historique, chaque « Retour » en dépile
  // une — le bouton du navigateur revient donc au niveau précédent, pas à la liste.
  const [stack, setStack] = useState<Array<{ title: string; node: ReactNode }>>([]);
  const depthRef = useRef(0);
  const [validated, setValidatedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setValidatedSet(getValidated());
    refresh();
    window.addEventListener("hibi-progress", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("hibi-progress", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const markDone = (code: string) => setValidated(code, true);
  const openView: OpenView = (title, node) => {
    setStack((s) => [...s, { title, node }]);
    depthRef.current += 1;
    window.history.pushState({ ...window.history.state, lrView: true }, "");
    window.scrollTo({ top: 0 });
  };
  const closeView = () => window.history.back();

  useEffect(() => {
    const onPop = () => {
      if (depthRef.current > 0) {
        depthRef.current -= 1;
        setStack((s) => s.slice(0, -1));
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Modules sans contenu (rien à faire) : validés dès l'ouverture.
  useEffect(() => {
    lesson.modules
      .filter((m) => {
        if (m.track === "vocab") return vocab.length === 0;
        if (m.track === "grammar") return grammar.length === 0 && grammarExercises.length === 0;
        if (m.track === "conjugation") return conjugation.length === 0 && conjExercises.length === 0;
        return true;
      })
      .forEach((m) => setValidated(m.lesson.code, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Vue plein écran (sommet de la pile) ----
  if (stack.length > 0) {
    const top = stack[stack.length - 1]!;
    return (
      <div className="lr-fullview">
        <button className="vrac-back lr-fullview-back" onClick={closeView}>← Retour</button>
        <h2 className="lr-fullview-title">{top.title}</h2>
        {top.node}
      </div>
    );
  }

  // Contenu plein écran d'un module d'apprentissage.
  const moduleContent = (m: CombinedModule): ReactNode => {
    const onEngage = () => markDone(m.lesson.code);
    if (m.track === "vocab") return <VocabContent m={m} words={vocab} onEngage={onEngage} openView={openView} />;
    if (m.track === "grammar") return <PointsContent m={m} rules={grammar} exercises={grammarExercises} onEngage={onEngage} openView={openView} />;
    if (m.track === "conjugation") return <PointsContent m={m} rules={conjugation} exercises={conjExercises} onEngage={onEngage} openView={openView} />;
    return <p className="lr-mod-note">Contenu à venir.</p>;
  };

  // Leçon terminée = tous les modules d'apprentissage (Partie 1) validés.
  const allDone = lesson.codes.length > 0 && lesson.codes.every((c) => validated.has(c));

  return (
    <div className="lr">
      <section className="lr-part">
        <div className="rm-part-head">
          <span className="rm-part-eyebrow">Partie 1</span>
          <h2 className="rm-part-title">Apprentissage</h2>
        </div>

        <div className="lr-modules">
          {lesson.modules.map((m) => {
            const done = validated.has(m.lesson.code);
            return (
              <button
                key={m.lesson.code}
                className={`lr-mod lr-mod-btn ${done ? "done" : ""}`}
                onClick={() => openView(`${TRACK_LABELS[m.track]} · ${m.lesson.title}`, moduleContent(m))}
              >
                <div className="lr-mod-top">
                  <span className="lr-mod-ic" aria-hidden>{TRACK_ICONS[m.track]}</span>
                  <div className="lr-mod-titles">
                    <span className="lr-mod-track">{TRACK_LABELS[m.track]}</span>
                    <span className="lr-mod-title">{m.lesson.title}</span>
                  </div>
                  {done
                    ? <span className="done-badge">Validé</span>
                    : <span className="lr-mod-caret" aria-hidden>›</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="lr-part">
        <div className="rm-part-head">
          <span className="rm-part-eyebrow">Partie 2</span>
          <h2 className="rm-part-title">Exercices</h2>
        </div>

        <div className="lr-modules">
          {PART2.map((ex) => {
            const code = `EX:${lesson.level}${lesson.num}:${ex.key}`;
            const done = validated.has(code);
            const real = ex.title === "Compréhension écrite" && comprehension;
            const node = real ? <ComprehensionView c={comprehension} /> : <ExercisePlaceholder ex={ex} />;
            return (
              <button
                key={ex.key}
                className={`lr-mod lr-mod-btn ${done ? "done" : ""}`}
                onClick={() => { if (real) markDone(code); openView(ex.title, node); }}
              >
                <div className="lr-mod-top">
                  <span className="lr-mod-ic" aria-hidden>{ex.icon}</span>
                  <div className="lr-mod-titles">
                    <span className="lr-mod-track">Exercice</span>
                    <span className="lr-mod-title">{ex.title}</span>
                  </div>
                  {done
                    ? <span className="done-badge">Validé</span>
                    : <span className="lr-mod-caret" aria-hidden>›</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {allDone && (
        <div className="lr-complete">
          <span className="lr-complete-ic" aria-hidden>🎉</span>
          <div className="lr-complete-txt">
            <b>Leçon {lesson.num} terminée !</b>
            <span>Tu as validé tout l&apos;apprentissage de cette leçon.</span>
          </div>
          {nextHref ? (
            <Link href={nextHref} className="btn primary lr-complete-cta">Leçon suivante →</Link>
          ) : (
            <Link href={"/plan" as Route} className="btn primary lr-complete-cta">Retour au plan →</Link>
          )}
        </div>
      )}
    </div>
  );
}

/** Exercice pas encore disponible — ouvert en plein écran (plus verrouillé). */
function ExercisePlaceholder({ ex }: { ex: { icon: string; title: string; desc: string } }) {
  return (
    <div className="ex-soon">
      <span className="ex-soon-ic" aria-hidden>{ex.icon}</span>
      <p className="ex-soon-desc">{ex.desc}</p>
      <span className="ex-soon-tag">Bientôt disponible</span>
    </div>
  );
}

/** Contenu plein écran du module vocabulaire : liste des mots + exercices. */
function VocabContent({ m, words, onEngage, openView }: { m: CombinedModule; words: VocabItemRow[]; onEngage: () => void; openView: OpenView }) {
  if (words.length === 0) return <p className="lr-mod-note">Contenu à venir — {m.lesson.count} mots.</p>;
  const cards = words.map((v) => ({ id: v.id, front: v.lemma, sub: v.reading ?? undefined, back: v.gloss }));
  return (
    <div className="lr-modview">
      <ul className="vlist">
        {words.map((v, i) => (
          <li
            key={v.id}
            className="vrow"
            onClick={() => openView(`Vocabulaire · ${m.lesson.title}`, <VocabPager words={words} startIndex={i} />)}
          >
            <span className="vnum">{i + 1}</span>
            <span className="vglyph">{v.lemma}</span>
            <span className="vreading">{v.reading ?? ""}</span>
            <span className="vgloss">{v.gloss}</span>
            <span className="vtags"><span className="vtype">{VOCAB_TYPE_LABELS[v.type] ?? v.type}</span></span>
          </li>
        ))}
      </ul>
      <button
        className="btn primary sm"
        style={{ marginTop: 16 }}
        onClick={() => openView(
          `Exercices — ${m.lesson.title}`,
          <>
            <p className="lm-intro">Révise chaque mot, puis auto-évalue-toi. La leçon se valide en fin de session.</p>
            <Flashcards kind="vocab" items={cards} onComplete={onEngage} />
          </>,
        )}
      >
        Faire les exercices ({words.length} cartes) →
      </button>
    </div>
  );
}

/** Contenu plein écran d'un module grammaire / conjugaison : règles + exercices. */
function PointsContent({ m, rules, exercises, onEngage, openView }: {
  m: CombinedModule;
  rules: GrammarRule[];
  exercises: ExItem[];
  onEngage: () => void;
  openView: OpenView;
}) {
  if (rules.length === 0 && exercises.length === 0) {
    return <p className="lr-mod-note">Contenu à venir — {m.lesson.count} règles.</p>;
  }
  return (
    <div className="lr-modview">
      {rules.length > 0 && (
        <ul className="lm-plist">
          {rules.map((r, i) => (
            <li
              key={i}
              className="lm-prow"
              onClick={() => { onEngage(); openView(r.title, <GrammarRuleView rule={r} />); }}
            >
              <span className="lm-prow-main">
                <span className="lm-prow-title">{r.title}</span>
                {r.formula && <span className="lm-prow-desc">{r.formula}</span>}
              </span>
              <span className="lm-prow-ar" aria-hidden>›</span>
            </li>
          ))}
        </ul>
      )}
      {exercises.length > 0 && (
        <button
          className="btn primary sm"
          style={{ marginTop: 16 }}
          onClick={() => openView(
            `Exercices — ${m.lesson.title}`,
            <>
              <p className="lm-intro">Traduis chaque phrase, compare avec le modèle, puis auto-évalue-toi.</p>
              <LessonExercise items={exercises} onComplete={onEngage} />
            </>,
          )}
        >
          Faire les exercices ({exercises.length * 2} questions) →
        </button>
      )}
    </div>
  );
}

/**
 * Fiche vocabulaire en plein écran, avec navigation précédent / suivant
 * (boutons ‹ › ou flèches clavier).
 */
function VocabPager({ words, startIndex }: { words: VocabItemRow[]; startIndex: number }) {
  const [i, setI] = useState(startIndex);
  const hasPrev = i > 0;
  const hasNext = i < words.length - 1;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && i > 0) setI((n) => n - 1);
      else if (e.key === "ArrowRight" && i < words.length - 1) setI((n) => n + 1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [i, words.length]);

  const v = words[i]!;
  return (
    <div className="vpager">
      {words.length > 1 && (
        <div className="vpager-nav">
          <button className="vpager-btn" disabled={!hasPrev} onClick={() => setI(i - 1)}>‹ Précédent</button>
          <span className="vpager-count">{i + 1} / {words.length}</span>
          <button className="vpager-btn" disabled={!hasNext} onClick={() => setI(i + 1)}>Suivant ›</button>
        </div>
      )}
      <FicheView key={v.id} item={v as unknown as FicheItem} verify={<VerifyForm kind="vocab" itemId={v.id} />} />
    </div>
  );
}
