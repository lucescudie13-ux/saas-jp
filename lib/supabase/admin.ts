import { createClient as createAdmin } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Client ADMIN avec la SERVICE ROLE KEY.
 * ⚠️ SERVEUR UNIQUEMENT. Ne jamais importer dans un Client Component.
 * Bypasse les RLS : à réserver aux tâches d'administration / d'écriture du contenu.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY manquante (serveur uniquement).");
  }
  return createAdmin<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
