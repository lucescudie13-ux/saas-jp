import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { getAccess, getValidatedCodes, buildGatedGroups } from "@/server/access/access.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { GrammarBrowser } from "@/components/features/GrammarBrowser";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";
import type { GrammarPointRow } from "@/types/database.types";

export default async function GrammarPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : "N5";
  const db = await createClient();

  const access = await getAccess(db);
  const [items, validated] = await Promise.all([
    contentService.listGrammar(db, active),
    getValidatedCodes(db, access.userId),
  ]);

  // Le slug d'un point de grammaire EST le code de leçon du curriculum.
  // Le filtrage se fait ici, côté serveur : `detail` contient tout le cours,
  // il ne doit pas partir dans la page pour une leçon non dévoilée.
  const bySlug = new Map<string, GrammarPointRow[]>();
  for (const g of items) {
    const list = bySlug.get(g.slug);
    if (list) list.push(g);
    else bySlug.set(g.slug, [g]);
  }

  const groups = buildGatedGroups(active, "grammar", validated, access, (code) => bySlug.get(code) ?? []);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Grammaire</span>
        <h1>Règles de grammaire</h1>
        <p>Les règles se dévoilent leçon par leçon : termine une leçon et la suivante s&apos;ouvre.</p>
      </div>
      <LevelTabs base="/grammar" active={active} />
      <GrammarBrowser groups={groups} />
    </>
  );
}
