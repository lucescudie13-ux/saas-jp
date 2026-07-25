// lib/skills.ts — Statistiques de compétences (0–100).
//
// Quatre compétences (compréhension / expression, orale / écrite) + un score
// général. Faute de données par compétence pour l'instant, on DÉRIVE chaque
// score de l'avancement réel par piste du niveau courant
// (vocabulaire / grammaire / conjugaison), avec une pondération propre à
// chaque compétence. Résultat : les barres montent quand on étudie, et
// diffèrent d'une compétence à l'autre. La formule est volontairement simple
// et remplaçable quand de vraies mesures (exercices notés) seront disponibles.

import { getLevelLessons, type Track } from "./curriculum";
import type { JlptLevel } from "./constants";

export interface SkillScore {
  key: string;
  label: string;
  short: string;
  icon: string;
  color: string;
  value: number; // 0–100
}

export interface SkillStatsResult {
  skills: SkillScore[];
  general: number; // 0–100
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const pct = (x: number) => Math.round(clamp01(x) * 100);

export function computeSkills(validated: Set<string>, level: JlptLevel): SkillStatsResult {
  const lessons = getLevelLessons(level);
  const totals: Record<Track, number> = { vocab: 0, grammar: 0, conjugation: 0 };
  const done: Record<Track, number> = { vocab: 0, grammar: 0, conjugation: 0 };

  for (const l of lessons) {
    for (const m of l.modules) {
      totals[m.track] += 1;
      if (validated.has(m.lesson.code)) done[m.track] += 1;
    }
  }

  const ratio = (t: Track) => (totals[t] ? done[t] / totals[t] : 0);
  const v = ratio("vocab");
  const g = ratio("grammar");
  const c = ratio("conjugation");

  const skills: SkillScore[] = [
    { key: "comp-orale",  label: "Compréhension orale",  short: "Compr. orale",  icon: "🎧", color: "#3E7CA6", value: pct(0.45 * v + 0.25 * g + 0.30 * c) },
    { key: "comp-ecrite", label: "Compréhension écrite", short: "Compr. écrite", icon: "📖", color: "#6E8B5B", value: pct(0.50 * v + 0.35 * g + 0.15 * c) },
    { key: "expr-orale",  label: "Expression orale",     short: "Expr. orale",   icon: "🎤", color: "#8A5BB0", value: pct(0.35 * v + 0.30 * g + 0.35 * c) },
    { key: "expr-ecrite", label: "Expression écrite",    short: "Expr. écrite",  icon: "✍️", color: "#C2402F", value: pct(0.30 * v + 0.40 * g + 0.30 * c) },
  ];

  const totalAll = totals.vocab + totals.grammar + totals.conjugation;
  const doneAll = done.vocab + done.grammar + done.conjugation;
  const general = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;

  return { skills, general };
}
