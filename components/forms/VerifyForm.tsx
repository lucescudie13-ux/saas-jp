"use client";

import { useState } from "react";
import type { ItemKind } from "@/lib/constants";

/**
 * « Vérifie tes connaissances » : l'utilisateur écrit une phrase avec le mot.
 * Enregistré via /api/sentence-submissions. La correction IA viendra plus tard
 * (feedback = null pour l'instant).
 */
export function VerifyForm({ kind, itemId }: { kind: ItemKind; itemId: string }) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");

  async function submit() {
    if (!value.trim()) return;
    setState("saving");
    const res = await fetch("/api/sentence-submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind, itemId, sentence: value.trim() }),
    });
    setState(res.ok ? "done" : "error");
  }

  return (
    <div className="verify">
      <label className="verify-label">Écris une phrase avec ce mot :</label>
      <textarea
        className="verify-input"
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Par exemple : 今日は日本語を学びます。"
      />
      <div className="verify-actions">
        <button className="btn primary" onClick={submit} disabled={state === "saving" || !value.trim()}>
          {state === "saving" ? "Enregistrement…" : "Vérifier"}
        </button>
        {state === "done" && (
          <span className="verify-note">Enregistré ✓ — la correction guidée arrivera bientôt.</span>
        )}
        {state === "error" && <span className="verify-note err">Une erreur est survenue.</span>}
      </div>
    </div>
  );
}
