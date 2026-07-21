"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Route } from "next";
import type { JlptLevel } from "@/lib/constants";

type Item = { href: Route; label: string; icon: string; jp?: boolean; badge?: string };

const MAIN: Item[] = [
  { href: "/dashboard", label: "Accueil", icon: "日", jp: true },
  { href: "/plan", label: "Plan d'étude", icon: "🗺️" },
  { href: "/vrac" as Route, label: "Vrac", icon: "💡" },
];

// Compréhension et Dialogues ne sont plus des entrées à part : ils vivent
// désormais à l'intérieur des leçons (Plan d'étude), inutile de les répéter ici.
const LEARN: Item[] = [
  { href: "/vocab", label: "Vocabulaire", icon: "語", jp: true },
  { href: "/phrases", label: "Phrases utiles", icon: "💬" },
  { href: "/grammar", label: "Grammaire", icon: "文", jp: true },
];

const TOOLS: { label: string; href: Route }[] = [
  { label: "Dictionnaire — recherche", href: "/tools/dictionary/search" },
  { label: "Dictionnaire — par thème", href: "/tools/dictionary/theme" },
  { label: "Rédaction guidée", href: "/tools/writing/redaction" },
  { label: "Correction de texte", href: "/tools/writing/texte" },
  { label: "Exercices — vocabulaire", href: "/tools/exercises/vocab" },
  { label: "Exercices — grammaire", href: "/tools/exercises/grammar" },
  { label: "Oral — prononciation", href: "/tools/oral/pronunciation" },
  { label: "Oral — conversation", href: "/tools/oral/conversation" },
  { label: "Oral — écoute", href: "/tools/oral/listening" },
];

const ACCOUNT: Item[] = [
  { href: "/stats", label: "Statistiques", icon: "📊" },
  { href: "/profile", label: "Profil", icon: "⚙️" },
];

export function Sidebar({ level }: { level: JlptLevel }) {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(pathname.startsWith("/tools"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <button className="side-toggle" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">☰</button>
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <Link className="brand" href="/dashboard">
          <div className="seal">日</div>
          <div className="brand-text"><b>日々 Hibi</b><span>Jour après jour</span></div>
        </Link>

        {MAIN.map((it) => (
          <NavLink key={it.href} item={it} active={isActive(it.href)} onClick={() => setMobileOpen(false)} />
        ))}

        <div className="nav-label">Apprendre</div>
        {LEARN.map((it) => (
          <NavLink key={it.href} item={{ ...it, badge: it.href === "/vocab" ? level : undefined }} active={isActive(it.href)} onClick={() => setMobileOpen(false)} />
        ))}

        <div className={`nav-group ${toolsOpen ? "open" : ""}`}>
          <button className="nav-item parent" onClick={() => setToolsOpen((o) => !o)}>
            <span className="nav-icon">✨</span> Outils IA
            <span className="nav-caret">▶</span>
          </button>
          <div className="nav-sub">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className={`nav-subitem ${isActive(t.href) ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="nav-label">Compte</div>
        {ACCOUNT.map((it) => (
          <NavLink key={it.href} item={it} active={isActive(it.href)} onClick={() => setMobileOpen(false)} />
        ))}

        <div className="side-note">
          <strong>Astuce</strong>
          Révise un peu chaque jour — la régularité bat l&apos;intensité. 頑張って !
        </div>
      </aside>
      {mobileOpen && <div className="side-scrim" onClick={() => setMobileOpen(false)} />}
    </>
  );
}

function NavLink({ item, active, onClick }: { item: Item; active: boolean; onClick: () => void }) {
  return (
    <Link href={item.href} className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      <span className={`nav-icon ${item.jp ? "jp" : ""}`}>{item.icon}</span>
      {item.label}
      {item.badge && <span className="nav-badge">{item.badge}</span>}
    </Link>
  );
}
