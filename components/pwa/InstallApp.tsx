"use client";

import { useCallback, useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    /** Invite d'installation mise de côté par le script de app/layout.tsx. */
    __hibiInstallPrompt: BIPEvent | null;
  }
}

/**
 * Bloc d'installation de la PWA. Le bouton est toujours présent et cliquable.
 *
 * L'invite native (`beforeinstallprompt`) est capturée très tôt par un script
 * du <head> — sinon Chrome la déclenche avant le montage de React et elle est
 * définitivement perdue. Ici on ne fait que la récupérer.
 *
 * Sans invite native disponible (Safari, Firefox, ou critères non réunis), le
 * bouton déplie la marche à suivre pour le navigateur courant.
 */
export function InstallApp() {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const isStandalone = useCallback(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true,
    [],
  );

  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsIOS(
      /iphone|ipad|ipod/i.test(ua) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
    setInstalled(isStandalone());

    // L'invite a pu être capturée avant le montage : on la lit maintenant, puis
    // on suit les notifications du script du <head>.
    const sync = () => setReady(Boolean(window.__hibiInstallPrompt));
    sync();
    const onInstalled = () => { setInstalled(true); setReady(false); };
    window.addEventListener("hibi-install-ready", sync);
    window.addEventListener("hibi-installed", onInstalled);
    return () => {
      window.removeEventListener("hibi-install-ready", sync);
      window.removeEventListener("hibi-installed", onInstalled);
    };
  }, [isStandalone]);

  async function install() {
    const prompt = typeof window !== "undefined" ? window.__hibiInstallPrompt : null;
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      // Une invite ne sert qu'une fois : Chrome en émettra une nouvelle si besoin.
      window.__hibiInstallPrompt = null;
      setReady(false);
      if (outcome === "accepted") setInstalled(true);
      return;
    }
    setShowHelp((s) => !s);
  }

  if (installed) {
    return (
      <div className="dl-install">
        <div className="dl-ok">✓ L&apos;application est installée. Lance-la depuis ton écran d&apos;accueil.</div>
      </div>
    );
  }

  return (
    <div className="dl-install">
      <button className="btn primary dl-btn" onClick={install} aria-expanded={showHelp}>
        ⬇️ Installer l&apos;application
      </button>

      {showHelp && !ready && (
        <div className="dl-hint">
          {isIOS ? (
            <>
              Sur iPhone / iPad, Safari n&apos;a pas de bouton d&apos;installation : appuie sur{" "}
              <b>Partager</b> <span className="dl-ic">⬆️</span> en bas de l&apos;écran, puis choisis{" "}
              <b>« Sur l&apos;écran d&apos;accueil »</b>.
            </>
          ) : (
            <>
              Ton navigateur n&apos;a pas proposé l&apos;installation automatique. Ouvre ce site dans{" "}
              <b>Chrome</b> ou <b>Edge</b>, puis utilise l&apos;icône d&apos;installation dans la barre
              d&apos;adresse, ou le menu <b>⋮ → Installer Hibi</b>. (Firefox et Safari sur ordinateur
              ne gèrent pas l&apos;installation.)
            </>
          )}
        </div>
      )}
    </div>
  );
}
