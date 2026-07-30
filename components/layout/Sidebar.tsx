"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";
import { DragonSidebarCard } from "@/components/features/DragonSidebarCard";

type Item = { href?: Route; label: string; icon: string; jp?: boolean; locked?: boolean };

// « Listes » — les référentiels à parcourir.
const LISTES: Item[] = [
  { href: "/vocab", label: "Vocabulaire", icon: "語", jp: true },
  { href: "/grammar", label: "Règles de grammaire", icon: "文", jp: true },
  { href: "/conjugation" as Route, label: "Règles de conjugaison", icon: "活", jp: true },
];

// « Entraînement personnalisé » — outils. Les deux derniers sont en cours de
// création → verrouillés (sablier), non cliquables.
const TRAINING: Item[] = [
  { href: "/tools/oral/expression" as Route, label: "Outil d'expression orale", icon: "🎤" },
  { href: "/tools/writing/expression" as Route, label: "Outil d'expression écrite", icon: "✍️" },
  { href: "/tools/exercises/vocab", label: "Exercices supplémentaires : vocabulaire", icon: "🎯" },
  { href: "/tools/exercises/grammar", label: "Exercices supplémentaires : grammaire", icon: "🧩" },
  { href: "/tools/exercises/conjugation" as Route, label: "Exercices supplémentaires : conjugaison", icon: "🔄" },
  { label: "Outil de compréhension orale", icon: "🎧", locked: true },
  { label: "Outil de compréhension écrite", icon: "📖", locked: true },
];

// « Application » — ce qui touche à l'outil lui-même, pas au compte.
const APP_ITEMS: Item[] = [
  { href: "/telecharger" as Route, label: "Télécharger l'app", icon: "⬇️" },
  { href: "/vrac" as Route, label: "Brouillon", icon: "🗒️" },
];

// « Gérer mon compte » — identité, abonnement, déconnexion.
const ACCOUNT: Item[] = [
  { href: "/profile", label: "Mon compte", icon: "⚙️" },
  { href: "/abonnement" as Route, label: "Abonnement", icon: "💳" },
];

/** En dessous de cette largeur, la barre recouvre le contenu au lieu de le pousser. */
const OVERLAY = "(max-width:880px)";
const KEY = "hibi-sidebar-open";

export function Sidebar({ level }: { level: JlptLevel }) {
  const pathname = usePathname();
  // Fermée par défaut : c'est un panneau qu'on ouvre, pas une colonne fixe.
  // Le choix est mémorisé d'une visite à l'autre.
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // L'état mémorisé n'est restauré QU'EN mode « pousse » (grand écran). En
  // recouvrement, la barre repart toujours fermée : sinon elle se rouvre
  // par-dessus le contenu, voile compris, à chaque retour sur une page.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(KEY) === "1" && !window.matchMedia(OVERLAY).matches) {
        setOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  /** Choix explicite de l'utilisateur → mémorisé. */
  const set = useCallback((next: boolean) => {
    setOpen(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const close = useCallback(() => set(false), [set]);

  /** Fermeture de circonstance (navigation, écran rétréci) : la préférence
   *  d'affichage sur grand écran n'est pas touchée. */
  const dismiss = useCallback(() => setOpen(false), []);

  // Changer de page referme la barre tant qu'elle recouvre le contenu — quel
  // que soit le lien emprunté, pas seulement ceux de la barre.
  useEffect(() => {
    if (window.matchMedia(OVERLAY).matches) dismiss();
  }, [pathname, dismiss]);

  // Rétrécir la fenêtre fait passer la barre en recouvrement : on la referme
  // plutôt que de laisser un panneau posé sur le contenu.
  useEffect(() => {
    const mq = window.matchMedia(OVERLAY);
    const onChange = () => { if (mq.matches) dismiss(); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [dismiss]);

  // Échap referme le panneau.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const closeIfOverlay = () => {
    if (typeof window !== "undefined" && window.matchMedia(OVERLAY).matches) dismiss();
  };

  return (
    <>
      <button
        className="side-toggle"
        onClick={() => set(!open)}
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls="sidebar"
      >
        {open ? "✕" : "☰"}
      </button>
      <aside id="sidebar" className={`sidebar ${open ? "open" : ""}`}>
        <Link className="brand" href="/plan">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <div className="brand-text"><b>日々 Hibi</b><span>Jour après jour</span></div>
        </Link>

        <DragonSidebarCard level={level} />

        <div className="nav-label">Listes</div>
        {LISTES.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={closeIfOverlay} />
        ))}

        <div className="nav-label">Entraînement personnalisé</div>
        {TRAINING.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={closeIfOverlay} />
        ))}

        <div className="nav-label">Application</div>
        {APP_ITEMS.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={closeIfOverlay} />
        ))}

        <div className="nav-label">Gérer mon compte</div>
        {ACCOUNT.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={closeIfOverlay} />
        ))}
      </aside>
      {/* Voile de fermeture — n'apparaît qu'en mode recouvrement (CSS). */}
      {open && <div className="side-scrim" onClick={close} />}
    </>
  );
}

function NavLink({ item, active, onClick }: { item: Item; active: boolean; onClick: () => void }) {
  if (item.locked || !item.href) {
    return (
      <span className="nav-item locked" title="En cours de création">
        <span className={`nav-icon ${item.jp ? "jp" : ""}`}>{item.icon}</span>
        {item.label}
        <span className="nav-soon" aria-hidden>⏳</span>
      </span>
    );
  }
  return (
    <Link href={item.href} className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      <span className={`nav-icon ${item.jp ? "jp" : ""}`}>{item.icon}</span>
      {item.label}
    </Link>
  );
}
