"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Bloc d'installation de la PWA. Le bouton est TOUJOURS présent et cliquable :
 * quand le navigateur propose l'installation native, il la déclenche ; sinon il
 * déplie la marche à suivre pour ce navigateur (iOS, Chrome/Edge, autres).
 * Avant, le bouton n'apparaissait que si `beforeinstallprompt` s'était déclenché
 * — c'est-à-dire presque jamais au premier chargement.
 */
export function InstallApp() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [done, setDone] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e as BIPEvent); };
    const onInstalled = () => { setInstalled(true); setDone(true); };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    // Invite native si le navigateur nous l'a proposée…
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setDone(true);
      setDeferred(null);
      return;
    }
    // …sinon on explique comment faire à la main.
    setShowHelp((s) => !s);
  }

  if (installed || done) {
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

      {showHelp && !deferred && (
        <div className="dl-hint">
          {isIOS ? (
            <>
              Sur iPhone / iPad : appuie sur <b>Partager</b> <span className="dl-ic">⬆️</span> en bas de Safari,
              puis choisis <b>« Sur l&apos;écran d&apos;accueil »</b>.
            </>
          ) : (
            <>
              Ouvre ce site dans <b>Chrome</b> ou <b>Edge</b>, puis utilise le menu <b>⋮ → Installer l&apos;application</b>
              {" "}(ou l&apos;icône d&apos;installation dans la barre d&apos;adresse).
            </>
          )}
        </div>
      )}
    </div>
  );
}
