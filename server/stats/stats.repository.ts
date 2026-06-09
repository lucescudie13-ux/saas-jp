import type { Database } from "@/types/database.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

export const statsRepository = {
  async sessionsSince(db: DB, userId: string, sinceIso: string) {
    const { data, error } = await db
      .from("study_sessions").select("*")
      .eq("user_id", userId).gte("occurred_at", sinceIso)
      .order("occurred_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },
  async progressByKindStatus(db: DB, userId: string) {
    const { data, error } = await db
      .from("user_item_progress").select("kind,status").eq("user_id", userId);
    if (error) throw error;
    return data ?? [];
  },
  async dueCount(db: DB, userId: string, nowIso: string) {
    const { count, error } = await db
      .from("user_item_progress").select("*", { count: "exact", head: true })
      .eq("user_id", userId).lte("due_at", nowIso);
    if (error) throw error;
    return count ?? 0;
  },
  async completedLessons(db: DB, userId: string) {
    const { count, error } = await db
      .from("lesson_progress").select("*", { count: "exact", head: true })
      .eq("user_id", userId).eq("status", "completed");
    if (error) throw error;
    return count ?? 0;
  },
};
