import type { Database } from "@/types/database.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

export const subscriptionRepository = {
  async getForUser(db: DB, userId: string) {
    const { data, error } = await db
      .from("subscriptions").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },
};
