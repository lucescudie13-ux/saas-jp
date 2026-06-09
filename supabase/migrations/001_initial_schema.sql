-- =====================================================================
-- 001 — Schéma initial 日々 Hibi
-- Contenu pédagogique (rempli par l'admin) + données utilisateur + SRS.
-- =====================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ----------------------------- Enums ---------------------------------
do $$ begin
  create type jlpt_level as enum ('N5','N4','N3','N2','N1');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vocab_type as enum ('kanji','mot','verbe','adjectif');
exception when duplicate_object then null; end $$;

do $$ begin
  create type item_type as enum ('vocab','phrase','grammar','dialogue','reading');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_direction as enum ('FR_JP','JP_FR');
exception when duplicate_object then null; end $$;

do $$ begin
  create type progress_status as enum ('new','learning','review','mastered');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lesson_status as enum ('not_started','in_progress','completed');
exception when duplicate_object then null; end $$;

-- --------------------- Fonction updated_at ---------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- =====================================================================
-- CONTENU PÉDAGOGIQUE (catalogue — écriture réservée à l'admin/serveur)
-- =====================================================================

-- Vocabulaire : champs riches (lectures, sens, clés, exemples…) en JSONB.
create table if not exists vocab_items (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  level       jlpt_level not null default 'N5',
  type        vocab_type not null,
  lemma       text not null,
  reading     text,
  gloss       text not null,
  readings    jsonb not null default '[]',   -- [{k:'on'|'kun', v:'…'}]
  sens        jsonb,                          -- {together, parts:[{g,r,m}]}
  decomp      text,
  keys        jsonb not null default '[]',    -- [{g,n}]
  mnemo       text,
  origin      text,
  cn          jsonb,                          -- {has,glyph,pinyin,note,hsk}
  examples    jsonb not null default '[]',    -- [{jp,yomi,fr}]
  confuse     jsonb not null default '[]',    -- [{g,n,d}]
  conj        jsonb,                          -- {group, rows:[[label,value]]}
  usage       text,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists phrases (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  level       jlpt_level not null default 'N5',
  lemma       text not null,
  reading     text,
  gloss       text not null,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists grammar_points (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  level       jlpt_level not null default 'N5',
  lemma       text not null,
  gloss       text not null,
  detail      text,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists grammar_questions (
  id          uuid primary key default gen_random_uuid(),
  grammar_id  uuid not null references grammar_points(id) on delete cascade,
  direction   question_direction not null,
  prompt      text not null,
  answer      text not null,
  position    int not null default 0
);

create table if not exists dialogues (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  level       jlpt_level not null default 'N5',
  lemma       text not null,           -- titre court (ex. カフェで注文)
  reading     text,
  gloss       text not null,           -- description
  title       text,                    -- titre affiché (ex. « Au café »)
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists dialogue_lines (
  id           uuid primary key default gen_random_uuid(),
  dialogue_id  uuid not null references dialogues(id) on delete cascade,
  speaker      text not null,
  jp           text not null,
  fr           text not null,
  position     int not null default 0
);

create table if not exists dialogue_questions (
  id           uuid primary key default gen_random_uuid(),
  dialogue_id  uuid not null references dialogues(id) on delete cascade,
  prompt       text not null,
  answer       text not null,
  position     int not null default 0
);

create table if not exists readings (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  level        jlpt_level not null default 'N5',
  title        text not null,
  body         text not null,
  translation  text,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists reading_questions (
  id           uuid primary key default gen_random_uuid(),
  reading_id   uuid not null references readings(id) on delete cascade,
  prompt       text not null,
  answer       text not null,
  position     int not null default 0
);

create table if not exists lessons (
  id          uuid primary key default gen_random_uuid(),
  level       jlpt_level not null,
  number      int not null,
  title       text not null,
  summary     text,
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (level, number)
);

-- Composition d'une leçon (lien polymorphe vers le contenu).
create table if not exists lesson_items (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references lessons(id) on delete cascade,
  kind        item_type not null,
  item_id     uuid not null,
  position    int not null default 0
);
create index if not exists lesson_items_lesson_idx on lesson_items(lesson_id);
create index if not exists lesson_items_item_idx on lesson_items(kind, item_id);

-- Réussites (catalogue).
create table if not exists achievements (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  emoji       text,
  description text,
  position    int not null default 0
);

-- =====================================================================
-- DONNÉES UTILISATEUR (privées — RLS par propriétaire)
-- =====================================================================

create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text,
  display_name    text,
  avatar_url      text,
  current_level   jlpt_level not null default 'N5',
  target_level    jlpt_level default 'N4',
  target_deadline date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists user_preferences (
  user_id            uuid primary key references profiles(id) on delete cascade,
  daily_goal_minutes int not null default 18,
  reminder_time      time,
  show_romaji        boolean not null default false,
  theme              text not null default 'washi',
  study_pair         text not null default 'fr-ja',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- Progression + état SRS (SM-2) par élément de contenu.
create table if not exists user_item_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references profiles(id) on delete cascade,
  kind             item_type not null,
  item_id          uuid not null,
  status           progress_status not null default 'new',
  ease_factor      numeric(4,2) not null default 2.50,
  interval_days    int not null default 0,
  repetitions      int not null default 0,
  lapses           int not null default 0,
  last_rating      text,
  last_reviewed_at timestamptz,
  due_at           timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, kind, item_id)
);
create index if not exists uip_due_idx on user_item_progress(user_id, due_at);

create table if not exists lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  lesson_id    uuid not null references lessons(id) on delete cascade,
  status       lesson_status not null default 'not_started',
  current_step int not null default 1,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Journal d'activité → série, minutes/jour, précision, stats.
create table if not exists study_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  activity        text not null,           -- 'vocab'|'phrases'|'grammar'|'dialogue'|'reading'|'flashcards'|'review'
  duration_seconds int not null default 0,
  items_reviewed  int not null default 0,
  correct         int not null default 0,
  total           int not null default 0,
  occurred_at     timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists study_sessions_user_time_idx on study_sessions(user_id, occurred_at);

-- Phrases soumises à la vérification (correction IA → TODO).
create table if not exists sentence_submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  kind        item_type not null,
  item_id     uuid not null,
  sentence    text not null,
  feedback    jsonb,                       -- rempli plus tard par l'IA
  created_at  timestamptz not null default now()
);

create table if not exists user_achievements (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  unlocked_at    timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- Abonnements — STUB. Aucune logique de paiement pour l'instant. TODO Stripe.
create table if not exists subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references profiles(id) on delete cascade,
  status                 text not null default 'inactive', -- inactive|trialing|active|past_due|canceled
  plan                   text,
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id)
);

-- --------------------- Triggers updated_at ---------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'vocab_items','phrases','grammar_points','dialogues','readings','lessons',
    'profiles','user_preferences','user_item_progress','lesson_progress','subscriptions'
  ] loop
    execute format(
      'drop trigger if exists set_updated_at on %I; create trigger set_updated_at before update on %I for each row execute function set_updated_at();',
      t, t);
  end loop;
end $$;
