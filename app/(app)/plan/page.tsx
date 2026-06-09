import Link from "next/link";
import type { Route } from "next";
import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { JLPT_LEVELS, LEVEL_LABELS } from "@/lib/constants";

export default async function PlanPage() {
  const db = await createClient();
  const lessons = await contentService.listLessons(db);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Du N5 au N1</h1>
        <p>Ta progression niveau par niveau. Déplie un niveau pour accéder à ses leçons.</p>
      </div>

      {JLPT_LEVELS.map((lv) => {
        const ls = lessons.filter((l) => l.level === lv).sort((a, b) => a.number - b.number);
        return (
          <details key={lv} className="plan-level" open={lv === "N5"}>
            <summary>
              <span className="lvl-tag">{lv}</span>
              {LEVEL_LABELS[lv]}
              <span className="lvl-sub" style={{ marginLeft: "auto" }}>{ls.length} leçon{ls.length > 1 ? "s" : ""}</span>
            </summary>
            {ls.length === 0 ? (
              <p className="empty" style={{ marginTop: 12 }}>Aucune leçon. Ajoute-en dans <code>lessons</code>.</p>
            ) : (
              <div className="lessons-row">
                {ls.map((l) => (
                  <Link key={l.id} className="lesson-cell" href={`/lesson/${l.level}/${l.number}` as Route} title={l.title}>
                    {l.number}
                  </Link>
                ))}
              </div>
            )}
          </details>
        );
      })}
    </>
  );
}
