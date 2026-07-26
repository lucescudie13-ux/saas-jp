"use client";

import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Bloc d'installation de la PWA : bouton natif quand disponible, sinon consignes. */
export function InstallApp() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [done, setDone] = useState(false);

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
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDone(true);
    setDeferred(null);
  }

  return (
    <div className="dl-install">
      {installed || done ? (
        <div className="dl-ok">✓ L&apos;application est installée. Lance-la depuis ton écran d&apos;accueil.</div>
      ) : deferred ? (
        <button className="btn primary dl-btn" onClick={install}>⬇️ Installer l&apos;application</button>
      ) : isIOS ? (
        <div className="dl-hint">
          Sur iPhone / iPad : appuie sur <b>Partager</b> <span className="dl-ic">⬆️</span> en bas de Safari,
          puis choisis <b>« Sur l&apos;écran d&apos;accueil »</b>.
        </div>
      ) : (
        <div className="dl-hint">
          Ouvre ce site dans <b>Chrome</b> ou <b>Edge</b>, puis utilise le menu <b>⋮ → Installer l&apos;application</b>
          {" "}(ou l&apos;icône d&apos;installation dans la barre d&apos;adresse).
        </div>
      )}
    </div>
  );
}
