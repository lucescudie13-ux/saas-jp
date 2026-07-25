import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { DragonView } from "@/components/features/DragonView";

// Page « Mon dragon » — le cœur de la gamification. Le dragon évolue au fil
// des leçons validées : XP, niveau et stade d'évolution y sont réunis.
export default async function DragonPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const level = current?.profile?.current_level ?? "N5";

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Mon dragon</span>
        <h1>Ton compagnon d&apos;étude</h1>
      </div>

      <DragonView level={level} />
    </>
  );
}
