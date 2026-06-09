import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { VocabBrowser } from "@/components/features/VocabBrowser";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function VocabPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : undefined;
  const db = await createClient();
  const items = await contentService.listVocab(db, active);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Vocabulaire</span>
        <h1>Mots & caractères</h1>
        <p>Touche un mot pour ouvrir sa fiche détaillée, ou passe en mode révision pour t&apos;entraîner avec la répétition espacée.</p>
      </div>
      <LevelTabs base="/vocab" active={active} />
      <VocabBrowser items={items} />
    </>
  );
}
