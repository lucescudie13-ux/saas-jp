"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { CombinedLesson, CombinedModule } from "@/lib/curriculum";
import { TRACK_LABELS, TRACK_ICONS } from "@/lib/curriculum";
import type { GrammarRule } from "@/lib/grammar-content";
import type { ExItem } from "@/lib/exercise-content";
import type { Comprehension } from "@/lib/comprehension-content";
import type { VocabItemRow } from "@/types/database.types";
import { VOCAB_TYPE_LABELS } from "@/lib/constants";
import { VocabDrawer } from "./VocabDrawer";
import { DetailDrawer } from "./DetailDrawer";
import { GrammarRuleView } from "./GrammarRuleView";
import { LessonExercise } from "./LessonExercise";
import { ComprehensionView } from "./ComprehensionView";
import { getValidated, setValidated } from "@/lib/lesson-progress";

const PART2 = [
  { icon: "📖", title: "Compréhension écrite", desc: "Un texte reprenant le vocabulaire de la leçon, suivi de questions." },
  { icon: "🎧", title: "Compréhension orale", desc: "Un dialogue audio reprenant le contenu de la leçon, suivi de questions." },
  { icon: "✍️", title: "Expression écrite", desc: "Un sujet à rédiger, avec correction personnalisée." },
  { icon: "🎤", title: "Expression orale", desc: "Un sujet à l'oral, avec correction personnalisée." },
];

export function LessonRoadmap({ lesson, vocab, grammar, conjugation, grammarExercises, conjExercises, comprehension }: {
  lesson: CombinedLesson;
  vocab: VocabItemRow[];
  grammar: GrammarRule[];
  conjugation: GrammarRule[];
  grammarExercises: ExItem[];
  conjExercises: ExItem[];
  comprehension: Comprehension | null;
}) {
  const [validated, setV] = useState<Set<string>>(new Set());
  const [compOpen, setCompOpen] = useState(false);

  useEffect(() => {
    setV(getValidated());
  }, []);

  function toggle(code: string) {
    const done = !validated.has(code);
    setV(new Set(setValidated(code, done)));
  }
  function validate(code: string) {
    setV(new Set(setValidated(code, true)));
  }

  const doneCount = lesson.modules.filter((m) => validated.has(m.lesson.code)).length;
  const allDone = lesson.modules.length > 0 && doneCount === lesson.modules.length;

  return (
    <div className="lr">
      <div className="rm-part">
        <div className="rm-part-head">
          <span className="rm-part-eyebrow">Partie 1</span>
          <h2 className="rm-part-title">Apprentissage</h2>
        </div>
        <span className={`rm-part-prog ${allDone ? "is-done" : ""}`}>
          {allDone ? "Terminé ✓" : `${doneCount} / ${lesson.modules.length}`}
        </span>
      </div>

      <div className="lr-modules">
        {lesson.modules.map((m) => {
          const done = validated.has(m.lesson.code);
          if (m.track === "vocab") {
            return <VocabModule key={m.lesson.code} m={m} words={vocab} done={done} onToggle={() => toggle(m.lesson.code)} />;
          }
          if (m.track === "grammar" && grammar.length > 0) {
            return <PointsModule key={m.lesson.code} m={m} rules={grammar} exercises={grammarExercises} done={done} onToggle={() => toggle(m.lesson.code)} onValidate={() => validate(m.lesson.code)} />;
          }
          if (m.track === "conjugation" && conjugation.length > 0) {
            return <PointsModule key={m.lesson.code} m={m} rules={conjugation} exercises={conjExercises} done={done} onToggle={() => toggle(m.lesson.code)} onValidate={() => validate(m.lesson.code)} />;
          }
          return (
            <div key={m.lesson.code} className={`lr-mod ${done ? "done" : ""}`}>
              <div className="lr-mod-top">
                <span className="lr-mod-ic" aria-hidden>{TRACK_ICONS[m.track]}</span>
                <div className="lr-mod-titles">
                  <span className="lr-mod-track">{TRACK_LABELS[m.track]}</span>
                  <span className="lr-mod-title">{m.lesson.title}</span>
                </div>
                <span className={`rm-status ${done ? "s-done" : "s-available"}`}>{done ? "Validé" : "À faire"}</span>
              </div>
              <p className="lr-mod-note">Contenu à venir — {m.lesson.count} règles. <code>{m.lesson.code}</code></p>
              <button className={`btn sm ${done ? "vlb-done" : "primary"}`} onClick={() => toggle(m.lesson.code)}>
                {done ? "✓ Validé — annuler" : "Valider ce module ✓"}
              </button>
            </div>
          );
        })}
      </div>

      {/* ---- Partie 2 : exercices (en construction) ---- */}
      <div className="rm-part lr-part2">
        <div className="rm-part-head">
          <span className="rm-part-eyebrow">Partie 2</span>
          <h2 className="rm-part-title">Exercices</h2>
        </div>
        <span className="rm-soon">En construction</span>
      </div>
      <div className="lr-modules">
        {PART2.map((ex) => {
          if (ex.title === "Compréhension écrite" && comprehension) {
            return (
              <div key={ex.title} className="lr-mod">
                <div className="lr-mod-top">
                  <span className="lr-mod-ic" aria-hidden>{ex.icon}</span>
                  <div className="lr-mod-titles">
                    <span className="lr-mod-track">Exercice</span>
                    <span className="lr-mod-title">{ex.title}</span>
                  </div>
                  <span className="rm-status s-available">Disponible</span>
                </div>
                <p className="lr-mod-note">Un texte reprenant le vocabulaire, suivi de {comprehension.questions.length} questions.</p>
                <button className="btn primary sm" onClick={() => setCompOpen(true)}>Lire le texte et répondre →</button>
              </div>
            );
          }
          return (
            <div key={ex.title} className="lr-mod locked">
              <div className="lr-mod-top">
                <span className="lr-mod-ic" aria-hidden>{ex.icon}</span>
                <div className="lr-mod-titles">
                  <span className="lr-mod-track">Exercice</span>
                  <span className="lr-mod-title">{ex.title}</span>
                </div>
                <span className="rm-status s-construction">🔒 Bientôt</span>
              </div>
              <p className="lr-mod-note">{ex.desc}</p>
            </div>
          );
        })}
      </div>

      <DetailDrawer open={compOpen} title="Compréhension écrite" onClose={() => setCompOpen(false)}>
        {comprehension && <ComprehensionView c={comprehension} />}
      </DetailDrawer>
    </div>
  );
}

function VocabModule({ m, words, done, onToggle }: { m: CombinedModule; words: VocabItemRow[]; done: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VocabItemRow | null>(null);
  return (
    <div className={`lr-mod ${done ? "done" : ""}`}>
      <div className="lr-mod-top">
        <span className="lr-mod-ic" aria-hidden>{TRACK_ICONS.vocab}</span>
        <div className="lr-mod-titles">
          <span className="lr-mod-track">{TRACK_LABELS.vocab}</span>
          <span className="lr-mod-title">{m.lesson.title}</span>
        </div>
        <span className={`rm-status ${done ? "s-done" : "s-available"}`}>{done ? "Validé" : "À faire"}</span>
      </div>
      <p className="lr-mod-note">{words.length} mots · touche un mot pour sa fiche. <code>{m.lesson.code}</code></p>
      <div className="lr-mod-actions">
        <button className="btn ghost sm" onClick={() => setOpen((o) => !o)}>
          {open ? "Masquer les mots" : `Voir les ${words.length} mots`}
        </button>
        <button className={`btn sm ${done ? "vlb-done" : "primary"}`} onClick={onToggle}>
          {done ? "✓ Validé — annuler" : "Valider ce module ✓"}
        </button>
      </div>
      {open && (
        <ul className="vlist" style={{ marginTop: 14 }}>
          {words.map((v) => (
            <li key={v.id} className="vrow" onClick={() => setSelected(v)}>
              <span className="vglyph">{v.lemma}</span>
              <span className="vreading">{v.reading ?? ""}</span>
              <span className="vgloss">{v.gloss}</span>
              <span className="vtags"><span className="vtype">{VOCAB_TYPE_LABELS[v.type] ?? v.type}</span></span>
            </li>
          ))}
        </ul>
      )}
      <VocabDrawer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function PointsModule({ m, rules, exercises, done, onToggle, onValidate }: {
  m: CombinedModule;
  rules: GrammarRule[];
  exercises: ExItem[];
  done: boolean;
  onToggle: () => void;
  onValidate: () => void;
}) {
  const [detail, setDetail] = useState<{ title: string; node: ReactNode } | null>(null);
  const [exOpen, setExOpen] = useState(false);
  const hasEx = exercises.length > 0;
  return (
    <div className={`lr-mod ${done ? "done" : ""}`}>
      <div className="lr-mod-top">
        <span className="lr-mod-ic" aria-hidden>{TRACK_ICONS[m.track]}</span>
        <div className="lr-mod-titles">
          <span className="lr-mod-track">{TRACK_LABELS[m.track]}</span>
          <span className="lr-mod-title">{m.lesson.title}</span>
        </div>
        <span className={`rm-status ${done ? "s-done" : "s-available"}`}>{done ? "Validé" : "À faire"}</span>
      </div>
      <p className="lr-mod-note">{rules.length} point{rules.length > 1 ? "s" : ""} · touche un point pour lire le cours.</p>
      <ul className="lm-plist" style={{ marginBottom: 12 }}>
        {rules.map((r, i) => (
          <li key={i} className="lm-prow" onClick={() => setDetail({ title: r.title, node: <GrammarRuleView rule={r} /> })}>
            <span className="lm-prow-main">
              <span className="lm-prow-title">{r.title}</span>
              {r.formula && <span className="lm-prow-desc">{r.formula}</span>}
            </span>
            <span className="lm-prow-ar" aria-hidden>›</span>
          </li>
        ))}
      </ul>

      {hasEx ? (
        <div className="lr-mod-actions">
          <button className={`btn sm ${done ? "ghost" : "primary"}`} onClick={() => setExOpen(true)}>
            {done ? "Refaire les exercices" : `Faire les exercices (${exercises.length * 2} questions) →`}
          </button>
          {done ? <span className="ex-validated">✓ Validé</span> : <span className="lr-mod-hint">Validé une fois les exercices terminés.</span>}
        </div>
      ) : (
        <button className={`btn sm ${done ? "vlb-done" : "primary"}`} onClick={onToggle}>
          {done ? "✓ Validé — annuler" : "Valider ce module ✓"}
        </button>
      )}

      <DetailDrawer open={detail !== null} title={detail?.title} onClose={() => setDetail(null)}>
        {detail?.node}
      </DetailDrawer>
      <DetailDrawer open={exOpen} title={`Exercices — ${m.lesson.title}`} onClose={() => setExOpen(false)}>
        <p className="lm-intro">Traduis chaque phrase, compare avec le modèle, puis auto-évalue-toi. Terminer un sens valide le module.</p>
        <LessonExercise items={exercises} onComplete={onValidate} />
      </DetailDrawer>
    </div>
  );
}
