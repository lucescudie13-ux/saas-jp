-- =====================================================================
-- 010 — Rôle du compte (accès administrateur)
--
-- Un compte `admin` accède à tout le contenu sans abonnement : c'est le
-- compte du créateur, et plus tard d'éventuels correcteurs ou testeurs.
--
-- Le rôle est en base (et non dans une variable d'environnement) pour être
-- modifiable depuis Supabase sans redéployer l'application.
--
-- SÉCURITÉ : la colonne est en LECTURE SEULE pour l'utilisateur. Les policies
-- de `profiles` autorisent « update own », donc sans garde un utilisateur
-- pourrait se promouvoir administrateur et tout débloquer gratuitement — la
-- même faille que celle refermée sur `subscriptions` en migration 008. Un
-- trigger interdit donc toute modification du rôle par autre chose que le
-- service role (webhook, back-office, SQL manuel).
-- =====================================================================

alter table profiles
  add column if not exists role text not null default 'user';

alter table profiles
  drop constraint if exists profiles_role_check;
alter table profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));

-- Empêche un utilisateur authentifié de changer son propre rôle.
create or replace function prevent_role_self_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    -- `auth.role()` vaut 'service_role' pour la clé de service, qui contourne
    -- les RLS : c'est le seul canal autorisé à promouvoir un compte.
    if coalesce(auth.role(), '') <> 'service_role' then
      raise exception 'le rôle ne peut pas être modifié par son propriétaire';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_self_change on profiles;
create trigger trg_prevent_role_self_change
  before update on profiles
  for each row
  execute function prevent_role_self_change();
