import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function PhrasesPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : undefined;
  const db = await createClient();
  const items = await contentService.listPhrases(db, active);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Phrases utiles</span>
        <h1>Expressions du quotidien</h1>
        <p>Des tournures prêtes à l&apos;emploi pour les situations courantes.</p>
      </div>
      <LevelTabs base="/phrases" active={active} />
      {items.length === 0 ? (
        <p className="empty">Aucune phrase pour ce niveau. Ajoute du contenu dans la table <code>phrases</code>.</p>
      ) : (
        <ul className="vlist">
          {items.map((p) => (
            <li key={p.id} className="vrow" style={{ cursor: "default" }}>
              <span className="vglyph" style={{ fontSize: 20, minWidth: 80 }}>{p.lemma}</span>
              <span className="vmid">
                {p.reading && <span className="vreading">{p.reading}</span>}
                <span className="vgloss">{p.gloss}</span>
              </span>
              <span className="vtags"><span className="jlpt-badge">{p.level}</span></span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
