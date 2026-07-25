import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { contentService } from "@/server/content/content.service";
import { statsService } from "@/server/stats/stats.service";
import type { VocabItemRow } from "@/types/database.types";
import { DailyHub } from "@/components/features/DailyHub";

// Nombre de mots dans le « Vocabulaire du jour ».
const DAILY_COUNT = 8;

// Sélection du jour : une tranche de mots qui tourne chaque jour.
function pickDaily(vocab: VocabItemRow[], n: number): VocabItemRow[] {
  if (vocab.length <= n) return vocab;
  const day = Math.floor(Date.now() / 86_400_000);
  const start = (day * n) % vocab.length;
  const out: VocabItemRow[] = [];
  for (let i = 0; i < n; i++) out.push(vocab[(start + i) % vocab.length]!);
  return out;
}

export default async function AujourdhuiPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const level = current?.profile?.current_level ?? "N5";
  const [vocab, stats] = await Promise.all([
    contentService.listVocab(db, level),
    current ? statsService.getDashboard(db, current.id).catch(() => null) : Promise.resolve(null),
  ]);
  const daily = pickDaily(vocab, DAILY_COUNT);

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Aujourd&apos;hui</span>
        <h1>Ta séance du jour</h1>
      </div>
      <DailyHub level={level} daily={daily} streak={stats?.currentStreak ?? 0} />
    </>
  );
}
