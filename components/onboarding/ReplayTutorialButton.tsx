"use client";

import { resetOnboarding } from "@/lib/onboarding";

/** Rejoue le tutoriel de bienvenue. Sans ce bouton, il serait impossible de le
 *  revoir — ni pour un utilisateur qui l'a passé trop vite, ni pour toi qui
 *  veux relire les textes après les avoir modifiés. */
export function ReplayTutorialButton() {
  return (
    <button className="btn ghost sm" onClick={() => resetOnboarding()}>
      Revoir le tutoriel
    </button>
  );
}
