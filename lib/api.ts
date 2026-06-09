import { createClient } from "@/lib/supabase/server";

/**
 * Récupère le client serveur + l'utilisateur authentifié pour une API Route.
 * Renvoie null si non connecté. L'identité provient TOUJOURS d'ici, jamais du body.
 */
export async function getAuthedContext() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  return { db, user };
}
