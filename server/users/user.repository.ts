import type { Database } from "@/types/database.types";
import type { ProfileUpdate } from "./user.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

export const userRepository = {
  async getProfile(db: DB, userId: string) {
    const { data, error } = await db.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async getPreferences(db: DB, userId: string) {
    const { data, error } = await db.from("user_preferences").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data;
  },
  async updateProfile(db: DB, userId: string, patch: ProfileUpdate) {
    const { data, error } = await db.from("profiles").update(patch).eq("id", userId).select("*").single();
    if (error) throw error;
    return data;
  },
};
