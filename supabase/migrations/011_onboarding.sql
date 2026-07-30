-- =====================================================================
-- 011 — Tutoriel de bienvenue vu (par COMPTE et non par navigateur)
--
-- Stocké en base pour qu'un utilisateur qui revient depuis un autre appareil
-- ne se refasse pas le tutoriel. Un horodatage plutôt qu'un booléen : on sait
-- aussi QUAND le compte a été accueilli, ce qui sert à mesurer l'activation.
--
-- `null` = jamais vu → le tutoriel s'affiche.
--
-- Pas de garde particulière ici, contrairement à `role` (migration 010) : que
-- l'utilisateur remette ce champ à zéro ne lui donne aucun droit, ça ne fait
-- que rejouer son propre tutoriel. C'est même exactement ce que fait le bouton
-- « Revoir le tutoriel » du profil.
-- =====================================================================

alter table profiles
  add column if not exists onboarded_at timestamptz;
