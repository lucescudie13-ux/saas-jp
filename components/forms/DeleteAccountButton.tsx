"use client";

import { useState } from "react";

const CONFIRM_WORD = "SUPPRIMER";

/**
 * Suppression définitive du compte (RGPD). Volontairement pénible à déclencher :
 * il faut recopier un mot, parce qu'un clic malheureux effacerait des mois de
 * progression sans retour possible.
 */
export function DeleteAccountButton() {
  const [step, setStep] = useState<"idle" | "confirm">("idle");
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function destroy() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(typeof body?.error === "string" ? body.error : "La suppression a échoué.");
        setBusy(false);
        return;
      }
      // La session ne vaut plus rien : on la ferme et on quitte l'application.
      await fetch("/auth/signout", { method: "POST" }).catch(() => null);
      window.location.href = "/";
    } catch {
      setError("La suppression a échoué.");
      setBusy(false);
    }
  }

  if (step === "idle") {
    return (
      <button className="btn ghost sm danger-text" onClick={() => setStep("confirm")}>
        Supprimer mon compte
      </button>
    );
  }

  return (
    <div className="reset-confirm">
      <p>
        <strong>Cette action est définitive.</strong> Ton compte, ta progression, ton dragon et
        ton abonnement seront supprimés. Aucune sauvegarde, aucun retour possible.
      </p>
      <p style={{ marginBottom: 8 }}>
        Recopie <strong>{CONFIRM_WORD}</strong> pour confirmer :
      </p>
      <input
        className="vocab-search"
        style={{ marginBottom: 12 }}
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder={CONFIRM_WORD}
        autoComplete="off"
        aria-label={`Recopie ${CONFIRM_WORD} pour confirmer`}
      />
      {error && <p className="portal-error">{error}</p>}
      <div className="reset-actions">
        <button
          className="btn danger sm"
          onClick={destroy}
          disabled={busy || word.trim().toUpperCase() !== CONFIRM_WORD}
        >
          {busy ? "Suppression…" : "Supprimer définitivement"}
        </button>
        <button className="btn ghost sm" onClick={() => { setStep("idle"); setWord(""); setError(null); }} disabled={busy}>
          Annuler
        </button>
      </div>
    </div>
  );
}
