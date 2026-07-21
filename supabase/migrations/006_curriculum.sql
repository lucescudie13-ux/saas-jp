-- 006_curriculum.sql — Structure du plan maître JLPT (N5 → N1).
-- Conception « base bien organisée » : une table pour les leçons du plan
-- (3 pistes : vocabulaire / grammaire / conjugaison), une table pour le
-- détail (règles/mots rattachés), une table pour la progression utilisateur.
-- Le squelette (codes + titres) vit pour l'instant dans lib/curriculum.ts ;
-- cette migration prépare la mise en base. À appliquer via `supabase db push`.

do $$ begin
  create type track_type as enum ('vocab','grammar','conjugation');
exception when duplicate_object then null; end $$;

-- ---- Leçons du plan (squelette) ----
create table if not exists curriculum_lessons (
  id          uuid primary key default gen_random_uuid(),
  level       jlpt_level not null,
  track       track_type not null,
  code        text unique not null,          -- ex. 'N5-01', 'F1-N5-01', 'V-N5-01'
  number      int not null,                  -- position dans (level, track)
  title       text not null,
  item_count  int not null default 0,        -- nb de règles (grammaire/conjugaison) ou de mots (vocab)
  position    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists curriculum_lessons_level_track_idx on curriculum_lessons(level, track, number);

-- ---- Détail : règles de grammaire / conjugaison rattachées à une leçon ----
create table if not exists curriculum_rules (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references curriculum_lessons(id) on delete cascade,
  position    int not null default 0,
  title       text not null,                 -- ex. « Copule neutre et polie — N／A-na + だ・です »
  formula     text,                          -- ex. « N／A-na + だ・です »
  detail      jsonb,                         -- contenu riche (sections, exemples…) ajouté ensuite
  created_at  timestamptz not null default now()
);
create index if not exists curriculum_rules_lesson_idx on curriculum_rules(lesson_id, position);

-- ---- Détail vocabulaire : rattache un vocab_items à une leçon du plan ----
create table if not exists curriculum_vocab (
  lesson_id   uuid not null references curriculum_lessons(id) on delete cascade,
  vocab_id    uuid not null references vocab_items(id) on delete cascade,
  position    int not null default 0,
  primary key (lesson_id, vocab_id)
);

-- ---- Progression utilisateur (leçon validée) ----
create table if not exists curriculum_progress (
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_code  text not null,
  validated_at timestamptz,
  primary key (user_id, lesson_code)
);

alter table curriculum_lessons enable row level security;
alter table curriculum_rules enable row level security;
alter table curriculum_vocab enable row level security;
alter table curriculum_progress enable row level security;

-- Lecture publique du plan ; progression propre à chaque utilisateur.
do $$ begin
  create policy "curriculum read" on curriculum_lessons for select using (true);
  create policy "curriculum rules read" on curriculum_rules for select using (true);
  create policy "curriculum vocab read" on curriculum_vocab for select using (true);
  create policy "progress own" on curriculum_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
