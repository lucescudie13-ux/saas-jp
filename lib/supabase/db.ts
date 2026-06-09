import type { createClient } from "./client";

/**
 * Type CANONIQUE du client Supabase, dérivé de notre fabrique `createClient`.
 * On l'utilise partout (repositories/services) pour éviter le décalage de
 * signatures génériques entre @supabase/ssr et @supabase/supabase-js.
 * Le client navigateur et le client serveur partagent ce même type.
 */
export type SupabaseDB = ReturnType<typeof createClient>;
