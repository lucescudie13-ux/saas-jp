import { createClient } from "@/lib/supabase/server";
import { userService } from "@/server/users/user.service";
import { subscriptionService } from "@/server/subscriptions/subscription.service";
import { LessonPath } from "@/components/features/LessonPath";

export default async function PlanPage() {
  const db = await createClient();
  const current = await userService.getCurrentUser(db);
  const premium = current
    ? (await subscriptionService.getStatus(db, current.id).catch(() => null))?.isPro ?? false
    : false;

  return (
    <>
      <div className="page-head">
        <span className="pill-tag">Plan d&apos;étude</span>
        <h1>Ton parcours</h1>
        <p>
          Progresse niveau par niveau, du N5 au N1. Suis la route, leçon après leçon,
          jusqu&apos;au boss qui valide chaque niveau.
        </p>
      </div>

      <LessonPath premium={premium} />
    </>
  );
}
