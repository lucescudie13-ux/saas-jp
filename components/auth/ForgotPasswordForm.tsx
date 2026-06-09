"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setNote(null);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.resetPasswordForEmail(String(fd.get("email")), {
      redirectTo: `${appUrl}/auth/callback?next=/profile`,
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setNote("Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé.");
  }

  return (
    <form className="form active" onSubmit={handle} noValidate>
      <div className="head">
        <h1>Mot de passe oublié</h1>
        <p>Indique ton e-mail : on t&apos;envoie un lien pour le réinitialiser.</p>
      </div>
      <div className="field">
        <label htmlFor="fp-email">Adresse e-mail</label>
        <div className="input-wrap"><span className="lead">✉️</span>
          <input type="email" id="fp-email" name="email" placeholder="toi@exemple.com" autoComplete="email" required />
        </div>
      </div>
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? "Envoi…" : "Envoyer le lien →"}
      </button>
      <div className="switch"><a className="link" href="/login">← Retour à la connexion</a></div>
      {error && <div className="note show" style={{ borderColor: "var(--vermilion)" }}><b>{error}</b></div>}
      {note && <div className="note show">{note}</div>}
    </form>
  );
}
