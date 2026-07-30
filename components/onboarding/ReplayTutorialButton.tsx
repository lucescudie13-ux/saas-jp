"use client";

import { useState } from "react";
import { resetOnboarding } from "@/lib/onboarding";

/** Rejoue le tutoriel de bienvenue. Sans ce bouton, il serait impossible de le
 *  revoir — ni pour un utilisateur qui l'a passé trop vite, ni pour toi qui
 *  veux relire les textes après les avoir modifiés.
 *
 *  Efface la date sur le compte ET le repère local, sinon le tutoriel resterait
 *  masqué par l'un des deux. */
export function ReplayTutorialButton() {
  const [busy, setBusy] = useState(false);

  async function replay() {
    setBusy(true);
    await resetOnboarding();
    setBusy(false);
  }

  return (
    <button className="btn ghost sm" onClick={replay} disabled={busy}>
      {busy ? "…" : "Revoir le tutoriel"}
    </button>
  );
}
