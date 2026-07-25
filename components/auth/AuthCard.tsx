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
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);

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
    const email = String(fd.get("email")).trim();
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(fd.get("password")),
      options: {
        data: { display_name: String(fd.get("display_name")) },
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      setError(
        /already registered|already exists/i.test(error.message)
          ? "Un compte existe déjà avec cet e-mail. Connecte-toi plutôt."
          : error.message
      );
      return;
    }

    // Quand la confirmation e-mail est active, Supabase masque les doublons :
    // il renvoie un utilisateur sans identité. On invite alors à se connecter.
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setNote("Un compte existe déjà avec cet e-mail. Connecte-toi plutôt.");
      setTab("login");
      return;
    }

    // Confirmation e-mail active (recommandé) → aucune session : on affiche l'écran
    // « vérifie ta boîte mail ». Le compte s'active en cliquant le lien reçu.
    if (!data.session) {
      setConfirmEmail(email);
      return;
    }

    // Confirmation désactivée → Supabase ouvre une session tout de suite. On ne veut
    // PAS entrer directement dans l'app : on ferme la session et on demande une vraie
    // connexion. (Active « Confirm email » dans Supabase pour l'écran de confirmation.)
    await supabase.auth.signOut();
    setNote("Compte créé ✓ Connecte-toi avec ton e-mail et ton mot de passe pour commencer.");
    setTab("login");
  }

  return (
    <div className="card">
      <div className="mini-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-mark" src="/logo.webp" alt="Hibi" />
        <div><b>日々 Hibi</b><br /><span>Jour après jour</span></div>
      </div>

      {confirmEmail ? (
        <div className="confirm-screen">
          <div className="confirm-ic" aria-hidden>📬</div>
          <h1>Vérifie ta boîte mail</h1>
          <p>On vient d&apos;envoyer un lien de confirmation à <b>{confirmEmail}</b>. Clique dessus pour activer ton compte, puis connecte-toi.</p>
          <button className="btn primary" onClick={() => { setConfirmEmail(null); setNote(null); setTab("login"); }}>Retour à la connexion</button>
          <p className="confirm-hint">Rien reçu ? Vérifie tes spams ou réessaie dans une minute.</p>
        </div>
      ) : (
      <>
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
            <span>J&apos;accepte les <a href="/conditions" target="_blank" rel="noopener noreferrer">Conditions d&apos;utilisation</a> et la <a href="/confidentialite" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>.</span>
          </label>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? "Création…" : "Créer mon compte →"}</button>
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
      </>
      )}
    </div>
  );
}
