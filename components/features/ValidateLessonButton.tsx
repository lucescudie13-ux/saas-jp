"use client";

import { useEffect, useState } from "react";
import { getValidated, setValidated } from "@/lib/lesson-progress";

/**
 * Bouton de validation d'une leçon. Marque la leçon comme validée (elle
 * devient verte dans la feuille de route) ; ré-appuyer annule la validation.
 */
export function ValidateLessonButton({ code }: { code: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(getValidated().has(code));
  }, [code]);

  function toggle() {
    const next = !done;
    setValidated(code, next);
    setDone(next);
  }

  return (
    <button className={`btn lm-validate ${done ? "vlb-done" : "primary"}`} onClick={toggle}>
      {done ? "✓ Leçon validée — annuler" : "Valider la leçon ✓"}
    </button>
  );
}
