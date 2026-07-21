"use client";

import { useState } from "react";
import { TranslationExercise, type TranslationItem, type ExerciseDirection } from "./TranslationExercise";

/**
 * Exercice de fin de leçon dans les deux sens : les mêmes paires de phrases
 * sont travaillées en japonais → français puis en français → japonais.
 * Deux onglets ; chaque sens repart de zéro (état indépendant grâce à `key`).
 */
export function LessonExercise({ items, onComplete }: { items: TranslationItem[]; onComplete?: () => void }) {
  const [dir, setDir] = useState<ExerciseDirection>("jp-fr");

  return (
    <div className="ex2">
      <div className="ex2-tabs" role="tablist" aria-label="Sens de traduction">
        <button
          role="tab"
          aria-selected={dir === "jp-fr"}
          className={`ex2-tab ${dir === "jp-fr" ? "active" : ""}`}
          onClick={() => setDir("jp-fr")}
        >
          Japonais → Français
          <span className="ex2-tab-n">{items.length} questions</span>
        </button>
        <button
          role="tab"
          aria-selected={dir === "fr-jp"}
          className={`ex2-tab ${dir === "fr-jp" ? "active" : ""}`}
          onClick={() => setDir("fr-jp")}
        >
          Français → Japonais
          <span className="ex2-tab-n">{items.length} questions</span>
        </button>
      </div>

      {/* key = dir → l'exercice se réinitialise à chaque changement de sens */}
      <TranslationExercise key={dir} items={items} direction={dir} onComplete={onComplete} />
    </div>
  );
}
