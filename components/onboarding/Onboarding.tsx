"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ONBOARDING_STEPS,
  locallyDismissed,
  markOnboardingSeen,
} from "@/lib/onboarding";

/**
 * Tutoriel de bienvenue, à la première visite. Le dragon mentor présente chaque
 * partie de la plateforme, une étape à la fois.
 *
 * Coût de chargement, puisque c'était la contrainte :
 *   • aucune bibliothèque d'animation — tout est en CSS
 *   • une seule image, un SVG de 5 ko déjà servi depuis /public
 *   • `show` vient du SERVEUR, qui a déjà le profil en main : aucune requête
 *     n'est faite pour savoir s'il faut afficher le tutoriel. Le seul appel
 *     réseau a lieu une fois, quand l'utilisateur le termine — et il part en
 *     arrière-plan, sans retarder la fermeture.
 */
export function Onboarding({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Le compte dit « jamais vu », mais on respecte aussi le repère local :
    // il évite de rejouer le tutoriel si l'écriture en base a échoué.
    if (show && !locallyDismissed()) setOpen(true);
    const replay = () => { setStep(0); setClosing(false); setOpen(true); };
    window.addEventListener("hibi-onboarding-replay", replay);
    return () => window.removeEventListener("hibi-onboarding-replay", replay);
  }, [show]);

  const finish = useCallback(() => {
    markOnboardingSeen();
    setClosing(true);
    // On laisse l'animation de sortie se jouer avant de démonter.
    window.setTimeout(() => { setOpen(false); setClosing(false); }, 220);
  }, []);

  const total = ONBOARDING_STEPS.length;
  const last = step >= total - 1;
  const next = useCallback(() => {
    if (last) finish();
    else setStep((s) => s + 1);
  }, [last, finish]);

  // Clavier : Échap passe, flèches et Entrée avancent.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight" || e.key === "Enter") next();
      else if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, next, finish]);

  if (!open) return null;
  const current = ONBOARDING_STEPS[step]!;

  return (
    <div className={`ob-scrim ${closing ? "is-closing" : ""}`} role="dialog" aria-modal="true" aria-label="Bienvenue">
      <div className="ob-card">
        <button className="ob-skip" onClick={finish}>Passer</button>

        <div className="ob-dragon">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/dragons/mentor.svg" alt="" width={168} height={168} />
        </div>

        {/* key={step} relance l'animation d'apparition à chaque étape. */}
        <div className="ob-body" key={step}>
          <span className="ob-icon" aria-hidden>{current.icon}</span>
          <h2 className="ob-title">{current.title}</h2>
          <p className="ob-text">{current.text}</p>
        </div>

        <div className="ob-foot">
          <div className="ob-dots" aria-hidden>
            {ONBOARDING_STEPS.map((_, i) => (
              <i key={i} className={i === step ? "on" : i < step ? "past" : ""} />
            ))}
          </div>
          <div className="ob-actions">
            {step > 0 && (
              <button className="btn ghost sm" onClick={() => setStep((s) => s - 1)}>
                Retour
              </button>
            )}
            <button className="btn primary sm" onClick={next}>
              {last ? "C'est parti !" : "Suivant →"}
            </button>
          </div>
        </div>

        <span className="ob-count" aria-live="polite">{step + 1} / {total}</span>
      </div>
    </div>
  );
}
