import type { Database } from "@/types/database.types";
import { userRepository } from "./user.repository";
import type { CurrentUser, ProfileUpdate } from "./user.types";

import type { SupabaseDB as DB } from "@/lib/supabase/db";

export const userService = {
  /** Récupère l'utilisateur courant (auth) + profil + préférences. */
  async getCurrentUser(db: DB): Promise<CurrentUser | null> {
    const { data: { user } } = await db.auth.getUser();
    if (!user) return null;
    const [profile, preferences] = await Promise.all([
      userRepository.getProfile(db, user.id),
      userRepository.getPreferences(db, user.id),
    ]);
    return { id: user.id, email: user.email ?? null, profile, preferences };
  },

  updateProfile(db: DB, userId: string, patch: ProfileUpdate) {
    return userRepository.updateProfile(db, userId, patch);
  },
};
