import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { VocabBrowser } from "@/components/features/VocabBrowser";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function VocabPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : "N5";
  const db = await createClient();
  const [items, byLesson] = await Promise.all([
    contentService.listVocab(db, active),
    contentService.listVocabByLesson(db, active),
  ]);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Vocabulaire</span>
        <h1>Mots & caractères</h1>
      </div>
      <LevelTabs base="/vocab" active={active} />
      <VocabBrowser items={items} byLesson={byLesson} />
    </>
  );
}
