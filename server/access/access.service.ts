import type { SupabaseDB as DB } from "@/lib/supabase/db";
import { userService } from "@/server/users/user.service";
import { subscriptionService } from "@/server/subscriptions/subscription.service";
import type { Access, GatedGroup } from "@/lib/access";
import { revealedLessonNumbers, canOpenLesson } from "@/lib/access";
import { getLevelLessons, type Track } from "@/lib/curriculum";
import type { JlptLevel } from "@/lib/constants";

/**
 * Lit les droits du visiteur courant : administrateur et/ou abonné.
 * Point d'entrée unique côté serveur, pour que les pages ne réinventent pas
 * la lecture du rôle et de l'abonnement chacune à leur façon.
 *
 * Tolérant aux pannes : en cas d'erreur (table absente, réseau), on retombe
 * sur « aucun droit » — un contenu payant reste fermé plutôt que de s'ouvrir
 * par accident.
 */
export async function getAccess(db: DB): Promise<Access & { userId: string | null }> {
  const current = await userService.getCurrentUser(db).catch(() => null);
  if (!current) return { isAdmin: false, isPro: false, userId: null };

  const isAdmin = current.profile?.role === "admin";
  // Un administrateur n'a pas besoin qu'on interroge Stripe.
  if (isAdmin) return { isAdmin: true, isPro: true, userId: current.id };

  const sub = await subscriptionService.getStatus(db, current.id).catch(() => null);
  return { isAdmin: false, isPro: sub?.isPro ?? false, userId: current.id };
}

/**
 * Codes de partie validés par l'utilisateur, lus EN BASE (`user_lesson_codes`).
 * C'est la source de vérité côté serveur : le cache localStorage du navigateur
 * ne peut pas servir à décider ce qu'on a le droit d'envoyer.
 */
export async function getValidatedCodes(db: DB, userId: string | null): Promise<Set<string>> {
  if (!userId) return new Set();
  const { data } = await db.from("user_lesson_codes").select("code").eq("user_id", userId);
  return new Set((data ?? []).map((r) => r.code));
}

/**
 * Construit les groupes d'une liste (vocabulaire, grammaire, conjugaison) en
 * ne laissant passer que le contenu dévoilé. `itemsForCode` fournit les
 * éléments d'un code de leçon ; il n'est appelé que pour les leçons dévoilées,
 * donc le reste ne quitte jamais le serveur.
 */
export function buildGatedGroups<T>(
  level: JlptLevel,
  track: Track,
  validated: Set<string>,
  access: Access,
  itemsForCode: (code: string) => T[],
): GatedGroup<T>[] {
  const lessons = getLevelLessons(level);
  const revealed = revealedLessonNumbers(level, lessons, validated, access);

  return lessons.flatMap((lesson) => {
    const mod = lesson.modules.find((m) => m.track === track);
    if (!mod) return [];
    const isRevealed = revealed.has(lesson.num);
    return [{
      num: lesson.num,
      title: mod.lesson.title,
      count: mod.lesson.count,
      revealed: isRevealed,
      items: isRevealed ? itemsForCode(mod.lesson.code) : [],
      lockReason: isRevealed
        ? undefined
        : canOpenLesson(level, lesson.num, access)
          ? ("progress" as const)
          : ("subscribe" as const),
    }];
  });
}
