import Link from "next/link";
import type { Route } from "next";
import { JLPT_LEVELS, LEVEL_LABELS, type JlptLevel } from "@/lib/constants";

// Onglets de filtre par niveau JLPT (liens ?level=).
export function LevelTabs({
  base,
  active,
}: {
  base: string;
  active?: JlptLevel;
}) {
  return (
    <div className="tabs-jlpt">
      <Link href={base as Route} className={`jtab ${!active ? "active" : ""}`}>Tous</Link>
      {JLPT_LEVELS.map((lv) => (
        <Link
          key={lv}
          href={`${base}?level=${lv}` as Route}
          className={`jtab ${active === lv ? "active" : ""}`}
          title={LEVEL_LABELS[lv]}
        >
          {lv}
        </Link>
      ))}
    </div>
  );
}
