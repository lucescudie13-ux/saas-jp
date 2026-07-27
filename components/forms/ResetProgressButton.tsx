"use client";

import { useState } from "react";
import { resetValidated } from "@/lib/lesson-progress";

/**
 * Remise à zéro de la progression : leçons validées, XP et niveau du dragon.
 * Demande une confirmation explicite (action irréversible).
 */
export function ResetProgressButton() {
  const [step, setStep] = useState<"idle" | "confirm" | "done">("idle");
  const [busy, setBusy] = useState(false);

  async function reset() {
    setBusy(true);
    await resetValidated();
    setBusy(false);
    setStep("done");
  }

  if (step === "done") {
    return <p className="reset-done">✓ Progression remise à zéro — dragon au niveau 1, 0 XP.</p>;
  }

  if (step === "confirm") {
    return (
      <div className="reset-confirm">
        <p>
          Toutes tes leçons validées seront effacées et ton dragon repartira au niveau 1.
          Cette action est définitive.
        </p>
        <div className="reset-actions">
          <button className="btn danger sm" onClick={reset} disabled={busy}>
            {busy ? "Réinitialisation…" : "Oui, tout remettre à zéro"}
          </button>
          <button className="btn ghost sm" onClick={() => setStep("idle")} disabled={busy}>
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <button className="btn ghost sm" onClick={() => setStep("confirm")}>
      Réinitialiser ma progression
    </button>
  );
}
