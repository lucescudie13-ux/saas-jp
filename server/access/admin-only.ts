import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccess } from "./access.service";

/**
 * Réserve une page aux administrateurs. Répond `notFound()` plutôt qu'une page
 * « accès refusé » : inutile de signaler l'existence d'un espace interne à un
 * utilisateur qui n'y a pas droit.
 *
 * À appeler au TOUT DÉBUT de la page, avant de charger quoi que ce soit — le
 * contenu réservé ne doit même pas être lu si l'accès est refusé.
 */
export async function requireAdmin(): Promise<void> {
  const access = await getAccess(await createClient());
  if (!access.isAdmin) notFound();
}
