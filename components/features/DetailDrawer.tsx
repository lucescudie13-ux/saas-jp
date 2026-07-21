"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

/**
 * Tiroir latéral générique (réutilise les classes .drawer du prototype).
 * Sert à afficher le détail d'un élément de liste : fiche de mot, point de
 * grammaire, règle de conjugaison… Fermeture au clic extérieur ou avec Échap.
 */
export function DetailDrawer({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Fermer">✕</button>
        {title && <h2 className="drawer-detail-title">{title}</h2>}
        {children}
      </aside>
    </>
  );
}
