import type { Database, ItemKind, UserItemProgressRow } from "@/types/database.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

/**
 * Accès données pour la progression SRS.
 * Le user_id provient TOUJOURS de l'utilisateur authentifié côté serveur,
 * jamais du client.
 */
export const progressRepository = {
  async getOne(db: DB, userId: string, kind: ItemKind, itemId: string) {
    const { data, error } = await db
      .from("user_item_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("kind", kind)
      .eq("item_id", itemId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async listByKind(db: DB, userId: string, kind: ItemKind) {
    const { data, error } = await db
      .from("user_item_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("kind", kind);
    if (error) throw error;
    return data ?? [];
  },

  async listDue(db: DB, userId: string, nowIso: string) {
    const { data, error } = await db
      .from("user_item_progress")
      .select("*")
      .eq("user_id", userId)
      .lte("due_at", nowIso)
      .order("due_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async upsert(db: DB, row: Partial<UserItemProgressRow> & { user_id: string; kind: ItemKind; item_id: string }) {
    const { data, error } = await db
      .from("user_item_progress")
      .upsert(row, { onConflict: "user_id,kind,item_id" })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },
};
