import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function GrammarPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : undefined;
  const db = await createClient();
  const items = await contentService.listGrammar(db, active);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Grammaire</span>
        <h1>Points de grammaire</h1>
        <p>Les structures essentielles, expliquées simplement, niveau par niveau.</p>
      </div>
      <LevelTabs base="/grammar" active={active} />
      {items.length === 0 ? (
        <p className="empty">Aucun point pour ce niveau. Ajoute du contenu dans <code>grammar_points</code>.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((g) => (
            <div key={g.id} className="block" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h3 className="block-title" style={{ margin: 0 }}>{g.lemma}</h3>
                <span className="jlpt-badge">{g.level}</span>
              </div>
              <div className="block-body" style={{ marginTop: 8 }}>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{g.gloss}</p>
                {g.detail && <p>{g.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
