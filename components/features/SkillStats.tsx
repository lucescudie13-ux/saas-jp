"use client";

import { useEffect, useState } from "react";
import type { JlptLevel } from "@/lib/constants";
import { getValidated } from "@/lib/lesson-progress";
import { computeSkills } from "@/lib/skills";

/**
 * Panneau de compétences (0–100) : compréhension / expression, orale / écrite,
 * plus un score général. Les valeurs sont dérivées des leçons validées et se
 * mettent à jour en direct (même mécanisme que le dragon).
 *
 * `variant="sidebar"` = version compacte pour la barre latérale ;
 * `"full"` = panneau détaillé pour la page « Mon dragon ».
 */
export function SkillStats({ level, variant = "full" }: { level: JlptLevel; variant?: "full" | "sidebar" }) {
  const [validated, setValidated] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refresh = () => setValidated(getValidated());
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

  const { skills, general } = computeSkills(validated, level);

  // ---------- Version barre latérale (compacte) ----------
  if (variant === "sidebar") {
    return (
      <div className="skills-side">
        <div className="skills-side-title">Compétences</div>
        {skills.map((s) => (
          <div className="skill-mini" key={s.key} title={s.label}>
            <span className="skill-mini-label">{s.short}</span>
            <span className="skill-mini-bar"><i style={{ width: `${s.value}%`, background: s.color }} /></span>
            <span className="skill-mini-val">{s.value}</span>
          </div>
        ))}
        <div className="skill-mini general">
          <span className="skill-mini-label">Général</span>
          <span className="skill-mini-bar"><i style={{ width: `${general}%` }} /></span>
          <span className="skill-mini-val">{general}</span>
        </div>
      </div>
    );
  }

  // ---------- Version détaillée (page) ----------
  return (
    <section className="skills panel">
      <div className="skills-head">
        <div>
          <span className="dragon-eyebrow">Compétences</span>
          <h3>Tes quatre compétences</h3>
        </div>
        <span className="skills-scale">/ 100</span>
      </div>

      <div className="skills-list">
        {skills.map((s) => (
          <div className="skill-row" key={s.key}>
            <div className="skill-label"><span className="skill-ic" aria-hidden>{s.icon}</span>{s.label}</div>
            <div className="skill-bar"><i style={{ width: `${s.value}%`, background: s.color }} /></div>
            <span className="skill-val">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="skill-row general">
        <div className="skill-label"><span className="skill-ic" aria-hidden>⭐</span>Niveau général</div>
        <div className="skill-bar"><i style={{ width: `${general}%` }} /></div>
        <span className="skill-val">{general}</span>
      </div>
    </section>
  );
}
