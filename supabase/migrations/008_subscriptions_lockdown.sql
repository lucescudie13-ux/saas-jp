-- =====================================================================
-- 008 — Sécurité abonnements
-- La table `subscriptions` pilote le déverrouillage des niveaux payants.
-- Elle NE DOIT être écrite que par le webhook Stripe (service role, qui
-- bypasse les RLS). Les policies « insert/update/delete own » du proto
-- permettraient à un utilisateur de s'auto-attribuer un abonnement actif
-- (et donc tout débloquer gratuitement). On les supprime ; on ne garde que
-- la LECTURE de son propre abonnement.
-- =====================================================================

drop policy if exists "subscriptions_insert_own" on subscriptions;
drop policy if exists "subscriptions_update_own" on subscriptions;
drop policy if exists "subscriptions_delete_own" on subscriptions;

-- "subscriptions_select_own" (lecture par le propriétaire) reste en place.
-- Aucune policy d'écriture pour `authenticated` → seul le service role écrit.
