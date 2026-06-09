import type { ProfileRow, UserPreferencesRow } from "@/types/database.types";
export type { ProfileRow, UserPreferencesRow };

export interface CurrentUser {
  id: string;
  email: string | null;
  profile: ProfileRow | null;
  preferences: UserPreferencesRow | null;
}

export interface ProfileUpdate {
  display_name?: string;
  avatar_url?: string;
  current_level?: ProfileRow["current_level"];
  target_level?: ProfileRow["target_level"];
  target_deadline?: string | null;
}
