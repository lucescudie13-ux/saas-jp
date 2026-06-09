import { createClient } from "@/lib/supabase/server";
import { contentService } from "@/server/content/content.service";
import { LevelTabs } from "@/components/features/LevelTabs";
import { JLPT_LEVELS, type JlptLevel } from "@/lib/constants";

export default async function DialoguePage({ searchParams }: { searchParams: Promise<{ level?: string }> }) {
  const { level } = await searchParams;
  const active = JLPT_LEVELS.includes(level as JlptLevel) ? (level as JlptLevel) : undefined;
  const db = await createClient();
  const list = await contentService.listDialogues(db, active);
  // Charge le détail (lignes) de chaque dialogue pour l'affichage déroulant.
  const full = await Promise.all(list.map((d) => contentService.getDialogue(db, d.id)));

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Dialogues</span>
        <h1>Mises en situation</h1>
        <p>Des conversations courtes pour entendre la langue en contexte.</p>
      </div>
      <LevelTabs base="/dialogue" active={active} />
      {full.length === 0 ? (
        <p className="empty">Aucun dialogue pour ce niveau. Ajoute du contenu dans <code>dialogues</code>.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {full.filter(Boolean).map((d) => (
            <details key={d!.id} className="plan-level">
              <summary>
                <span className="lvl-tag">{d!.level}</span>
                {d!.title ?? d!.lemma}
                <span className="lvl-sub" style={{ marginLeft: "auto" }}>{d!.gloss}</span>
              </summary>
              <div style={{ marginTop: 14 }}>
                {d!.lines.map((l) => (
                  <div key={l.id} className="dlg-line">
                    <span className="dlg-who">{l.speaker}</span>
                    <span><span className="dlg-jp">{l.jp}</span><br /><span className="dlg-fr">{l.fr}</span></span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
