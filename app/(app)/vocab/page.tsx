import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { getAccess, getValidatedCodes, buildGatedGroups } from "@/server/access/access.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { VocabBrowser } from "@/components/features/VocabBrowser";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import type { VocabItemRow } from "@/types/database.types";

/** Code de leçon d'un mot, déduit de son slug : V-N5-01-007 → V-N5-01. */
function lessonCodeOf(slug: string): string {
  return slug.replace(/-\d+$/, "");
}

export default async function VocabPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : "N5";
  const db = await createClient();

  const access = await getAccess(db);
  const [items, validated] = await Promise.all([
    contentService.listVocab(db, active),
    getValidatedCodes(db, access.userId),
  ]);

  // Regroupement par code de leçon, puis filtrage par ce qui est dévoilé.
  // Les mots des leçons verrouillées sont écartés ICI : ils ne partent pas
  // dans la page, seul leur nombre est annoncé.
  const byCode = new Map<string, VocabItemRow[]>();
  for (const v of items) {
    const code = lessonCodeOf(v.slug);
    const list = byCode.get(code);
    if (list) list.push(v);
    else byCode.set(code, [v]);
  }

  const groups = buildGatedGroups(active, "vocab", validated, access, (code) => byCode.get(code) ?? []);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Vocabulaire</span>
        <h1>Mots &amp; caractères</h1>
        <p>
          Le vocabulaire se dévoile leçon par leçon : termine une leçon et celle qui suit
          s&apos;ouvre. Les mots encore verrouillés restent visibles, pour savoir ce qui t&apos;attend.
        </p>
      </div>
      <LevelTabs base="/vocab" active={active} />
      <VocabBrowser groups={groups} />
    </>
  );
}
