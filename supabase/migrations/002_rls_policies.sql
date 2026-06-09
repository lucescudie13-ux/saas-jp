-- =====================================================================
-- 002 — Row Level Security
-- Contenu : lecture pour les utilisateurs authentifiés, écriture refusée
--           (l'admin écrit via la service role key, qui bypasse les RLS).
-- Données utilisateur : accès strictement limité au propriétaire.
-- Règle d'or : on ne fait JAMAIS confiance à un user_id venu du client ;
--              les policies s'appuient sur auth.uid().
-- =====================================================================

-- ----------------------- Tables de contenu --------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'vocab_items','phrases','grammar_points','grammar_questions',
    'dialogues','dialogue_lines','dialogue_questions',
    'readings','reading_questions','lessons','lesson_items','achievements'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "read_authenticated" on %I;', t);
    execute format(
      'create policy "read_authenticated" on %I for select to authenticated using (true);',
      t);
    -- Pas de policy insert/update/delete → écriture refusée sauf service role.
  end loop;
end $$;

-- --------------------------- profiles --------------------------------
alter table profiles enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- L'insertion du profil est faite par le trigger (security definer).

-- ------------------- Tables « owner = user_id » ----------------------
do $$
declare t text;
begin
  foreach t in array array[
    'user_preferences','user_item_progress','lesson_progress',
    'study_sessions','sentence_submissions','user_achievements','subscriptions'
  ] loop
    execute format('alter table %I enable row level security;', t);

    execute format('drop policy if exists "%s_select_own" on %I;', t, t);
    execute format(
      'create policy "%s_select_own" on %I for select to authenticated using (user_id = auth.uid());',
      t, t);

    execute format('drop policy if exists "%s_insert_own" on %I;', t, t);
    execute format(
      'create policy "%s_insert_own" on %I for insert to authenticated with check (user_id = auth.uid());',
      t, t);

    execute format('drop policy if exists "%s_update_own" on %I;', t, t);
    execute format(
      'create policy "%s_update_own" on %I for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());',
      t, t);

    execute format('drop policy if exists "%s_delete_own" on %I;', t, t);
    execute format(
      'create policy "%s_delete_own" on %I for delete to authenticated using (user_id = auth.uid());',
      t, t);
  end loop;
end $$;

-- Note : `subscriptions` est en lecture/écriture par le propriétaire pour le
-- prototype ; quand Stripe sera branché, restreindre l'écriture au webhook
-- (service role) et ne laisser que le select au propriétaire. TODO Stripe.
