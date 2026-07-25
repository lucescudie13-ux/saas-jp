"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Tab = "login" | "signup";

export function AuthCard({ initialTab }: { initialTab: Tab }) {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [showPw, setShowPw] = useState(false);
  const [pwScore, setPwScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Origine pour les redirections (confirmation e-mail, OAuth). On retombe sur
  // l'origine du navigateur si NEXT_PUBLIC_APP_URL n'est pas défini → jamais cassé.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");

  function onPwInput(v: string) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[0-9]/.test(v) && /[a-zA-Z]/.test(v)) s++;
    if (v.length >= 12 || /[^a-zA-Z0-9]/.test(v)) s++;
    setPwScore(v ? Math.max(1, s) : 0);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setNote(null);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) { setError("E-mail ou mot de passe incorrect."); return; }
    router.push("/plan");
    router.refresh();
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setNote(null);
    const fd = new FormData(e.currentTarget);
    const { data, error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        data: { display_name: String(fd.get("display_name")) },
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    // Confirmation e-mail désactivée → une session existe déjà : on entre dans l'app.
    if (data.session) {
      router.push("/plan");
      router.refresh();
      return;
    }
    // Confirmation e-mail activée → pas de session : il faut valider par e-mail.
    setNote("Compte créé ✓ Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.");
    setTab("login");
  }

  async function oauth(provider: "google" | "apple") {
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${appUrl}/auth/callback` },
    });
  }

  return (
    <div className="card">
      <div className="mini-brand">
        <div className="seal">日</div>
        <div><b>日々 Hibi</b><br /><span>Jour après jour</span></div>
      </div>

      <div className="tabs" role="tablist">
        <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Connexion</button>
        <button className={`tab ${tab === "signup" ? "active" : ""}`} onClick={() => setTab("signup")}>Créer un compte</button>
      </div>

      {tab === "login" ? (
        <form className="form active" onSubmit={handleLogin} noValidate>
          <div className="head"><h1>Content de te revoir</h1><p>Reprends ton apprentissage là où tu t&apos;es arrêté.</p></div>
          <div className="field">
            <label htmlFor="login-email">Adresse e-mail</label>
            <div className="input-wrap"><span className="lead">✉️</span>
              <input type="email" id="login-email" name="email" placeholder="toi@exemple.com" autoComplete="email" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="login-pw">Mot de passe</label>
            <div className="input-wrap"><span className="lead">🔒</span>
              <input type={showPw ? "text" : "password"} id="login-pw" name="password" placeholder="••••••••" autoComplete="current-password" required />
              <button type="button" className="toggle-pw" onClick={() => setShowPw((s) => !s)}>{showPw ? "Masquer" : "Afficher"}</button>
            </div>
          </div>
          <div className="row-between">
            <label className="check"><input type="checkbox" name="remember" defaultChecked /> Se souvenir de moi</label>
            <a className="link" href="/forgot-password">Mot de passe oublié ?</a>
          </div>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Connexion…" : "Se connecter →"}</button>
          <OAuthRow onClick={oauth} label="ou continuer avec" />
          {error && <div className="note show" style={{ borderColor: "var(--vermilion)" }}><b>{error}</b></div>}
          {note && <div className="note show">{note}</div>}
        </form>
      ) : (
        <form className="form active" onSubmit={handleSignup} noValidate>
          <div className="head"><h1>Crée ton compte</h1><p>Quelques secondes, et ta première leçon t&apos;attend.</p></div>
          <div className="field">
            <label htmlFor="signup-name">Nom affiché</label>
            <div className="input-wrap"><span className="lead">👤</span>
              <input type="text" id="signup-name" name="display_name" placeholder="Ton prénom ou pseudo" autoComplete="nickname" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="signup-email">Adresse e-mail</label>
            <div className="input-wrap"><span className="lead">✉️</span>
              <input type="email" id="signup-email" name="email" placeholder="toi@exemple.com" autoComplete="email" required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="signup-pw">Mot de passe</label>
            <div className="input-wrap"><span className="lead">🔒</span>
              <input type={showPw ? "text" : "password"} id="signup-pw" name="password" placeholder="8 caractères minimum" autoComplete="new-password" minLength={8} onChange={(e) => onPwInput(e.target.value)} required />
              <button type="button" className="toggle-pw" onClick={() => setShowPw((s) => !s)}>{showPw ? "Masquer" : "Afficher"}</button>
            </div>
            <div className={`pw-meter ${pwScore ? "s" + pwScore : ""}`}><i /><i /><i /></div>
            <div className="pw-hint">{["Au moins 8 caractères, avec chiffres et lettres.", "Mot de passe faible.", "Mot de passe correct.", "Mot de passe solide 👍"][pwScore]}</div>
          </div>
          <label className="check terms">
            <input type="checkbox" name="terms" required />
            <span>J&apos;accepte les <a href="#">Conditions d&apos;utilisation</a> et la <a href="#">Politique de confidentialité</a>.</span>
          </label>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Création…" : "Créer mon compte →"}</button>
          <OAuthRow onClick={oauth} label="ou s'inscrire avec" />
          {error && <div className="note show" style={{ borderColor: "var(--vermilion)" }}><b>{error}</b></div>}
          {note && <div className="note show">{note}</div>}
        </form>
      )}

      <div className="switch">
        <span>{tab === "login" ? "Pas encore de compte ?" : "Tu as déjà un compte ?"}</span>{" "}
        <button onClick={() => setTab(tab === "login" ? "signup" : "login")}>
          {tab === "login" ? "Crée-le en 30 secondes" : "Connecte-toi"}
        </button>
      </div>
    </div>
  );
}

function OAuthRow({ onClick, label }: { onClick: (p: "google" | "apple") => void; label: string }) {
  return (
    <>
      <div className="divider">{label}</div>
      <div className="oauth-row">
        <button type="button" className="btn oauth" onClick={() => onClick("google")}>Google</button>
        <button type="button" className="btn oauth" onClick={() => onClick("apple")}>Apple</button>
      </div>
    </>
  );
}
