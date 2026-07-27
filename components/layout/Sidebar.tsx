"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";
import { DragonSidebarCard } from "@/components/features/DragonSidebarCard";

type Item = { href?: Route; label: string; icon: string; jp?: boolean; locked?: boolean };

// « Listes » — les référentiels à parcourir.
const LISTES: Item[] = [
  { href: "/vocab", label: "Vocabulaire", icon: "語", jp: true },
  { href: "/phrases", label: "Phrases utiles", icon: "💬" },
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

const ACCOUNT: Item[] = [
  { href: "/vrac" as Route, label: "Brouillon", icon: "🗒️" },
  { href: "/telecharger" as Route, label: "Télécharger l'app", icon: "⬇️" },
  { href: "/profile", label: "Profil", icon: "⚙️" },
];

export function Sidebar({ level }: { level: JlptLevel }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const close = () => setMobileOpen(false);

  return (
    <>
      <button className="side-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">☰</button>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <Link className="brand" href="/plan">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/logo.webp" alt="Hibi" />
          <div className="brand-text"><b>日々 Hibi</b><span>Jour après jour</span></div>
        </Link>

        <DragonSidebarCard level={level} />

        <div className="nav-label">Listes</div>
        {LISTES.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={close} />
        ))}

        <div className="nav-label">Entraînement personnalisé</div>
        {TRAINING.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={close} />
        ))}

        <div className="nav-label">Compte</div>
        {ACCOUNT.map((it) => (
          <NavLink key={it.label} item={it} active={!!it.href && isActive(it.href)} onClick={close} />
        ))}
      </aside>
      {mobileOpen && <div className="side-scrim" onClick={close} />}
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
