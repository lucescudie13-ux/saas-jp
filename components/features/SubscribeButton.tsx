"use client";

import { useState } from "react";

/**
 * Démarre le paiement : POST /api/checkout → redirection Stripe Checkout.
 * `plan` = "monthly" (abonnement) ou "lifetime" (accès à vie, paiement unique).
 * Si Stripe n'est pas encore configuré, affiche un message et ne casse rien.
 */
export function SubscribeButton({
  label = "Passer à Pro →",
  className = "btn primary",
  plan = "monthly",
}: {
  label?: string;
  className?: string;
  plan?: "monthly" | "lifetime";
}) {
  const [loading, setLoading] = useState(false);

  async function go() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const body = (await res.json().catch(() => null)) as { data?: { url?: string }; error?: string } | null;
      const url = body?.data?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      alert(typeof body?.error === "string" ? body.error : "Paiements bientôt disponibles.");
    } catch {
      alert("Paiements bientôt disponibles.");
    }
    setLoading(false);
  }

  return (
    <button type="button" className={className} onClick={go} disabled={loading}>
      {loading ? "…" : label}
    </button>
  );
}
