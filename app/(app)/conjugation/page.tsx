import { createClient } from "@/lib/supabase/server";
import { getAccess, getValidatedCodes, buildGatedGroups } from "@/server/access/access.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { ConjugationBrowser } from "@/components/features/ConjugationBrowser";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

// Le niveau passe désormais par l'URL (comme /vocab et /grammar) et non plus par
// un état local : le dévoilement se décide côté serveur, il faut donc que le
// serveur sache quel niveau est demandé.
export default async function ConjugationPage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : "N5";
  const db = await createClient();

  const access = await getAccess(db);
  const validated = await getValidatedCodes(db, access.userId);

  // Les règles de conjugaison viennent du curriculum : le « contenu » d'un
  // groupe est le code de sa leçon, qui sert à construire le lien.
  const groups = buildGatedGroups(active, "conjugation", validated, access, (code) => [{ code }]);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Conjugaison</span>
        <h1>Règles de conjugaison</h1>
        <p>Les règles se dévoilent leçon par leçon : termine une leçon et la suivante s&apos;ouvre.</p>
      </div>
      <LevelTabs base="/conjugation" active={active} />
      <ConjugationBrowser level={active} groups={groups} />
    </>
  );
}
