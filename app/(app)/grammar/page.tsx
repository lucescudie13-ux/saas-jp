import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { GrammarBrowser } from "@/components/features/GrammarBrowser";
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
      <GrammarBrowser items={items} />
    </>
  );
}
