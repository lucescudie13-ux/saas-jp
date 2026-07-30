"use client";

import { useState } from "react";

/**
 * Ouvre le portail de facturation Stripe (résiliation, moyen de paiement,
 * factures). Le lien est à usage unique et généré à la demande : il ne peut
 * donc pas être mis en dur dans la page.
 */
export function BillingPortalButton({
  label = "Gérer mon abonnement",
  className = "btn ghost",
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const body = (await res.json().catch(() => null)) as
        | { data?: { url?: string }; error?: string }
        | null;
      const url = body?.data?.url;
      if (url) {
        window.location.href = url;
        return;
      }
      setError(typeof body?.error === "string" ? body.error : "Portail indisponible.");
    } catch {
      setError("Portail indisponible.");
    }
    setLoading(false);
  }

  return (
    <>
      <button type="button" className={className} onClick={open} disabled={loading}>
        {loading ? "…" : label}
      </button>
      {error && <p className="portal-error">{error}</p>}
    </>
  );
}
