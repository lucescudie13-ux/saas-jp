import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function ReadingPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : undefined;
  const db = await createClient();
  const items = await contentService.listReadings(db, active);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Compréhension écrite</span>
        <h1>Lectures</h1>
        <p>De courts textes pour t&apos;exercer à lire. La traduction reste masquée jusqu&apos;à ce que tu l&apos;ouvres.</p>
      </div>
      <LevelTabs base="/reading" active={active} />
      {items.length === 0 ? (
        <p className="empty">Aucune lecture pour ce niveau. Ajoute du contenu dans <code>readings</code>.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {items.map((r) => (
            <div key={r.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span className="jlpt-badge">{r.level}</span>
                <strong style={{ fontSize: 17 }}>{r.title}</strong>
              </div>
              <div className="read-body">{r.body}</div>
              {r.translation && (
                <details style={{ marginTop: 10 }}>
                  <summary style={{ cursor: "pointer", color: "var(--vermilion-deep)", fontWeight: 700 }}>Voir la traduction</summary>
                  <p className="read-trans">{r.translation}</p>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
