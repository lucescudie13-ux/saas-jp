-- Progression du plan d'étude reliée au compte.
-- La validation des leçons/modules est identifiée par un « code » de curriculum
-- (ex. « N5-01 »), défini côté application. On stocke simplement les codes validés
-- par utilisateur ; le client garde localStorage comme cache instantané et
-- synchronise avec cette table (survit à un vidage de cache + multi-appareils).
create table if not exists user_lesson_codes (
  user_id    uuid not null references profiles(id) on delete cascade,
  code       text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, code)
);

alter table user_lesson_codes enable row level security;

create policy "own lesson codes: read"
  on user_lesson_codes for select using (auth.uid() = user_id);
create policy "own lesson codes: insert"
  on user_lesson_codes for insert with check (auth.uid() = user_id);
create policy "own lesson codes: delete"
  on user_lesson_codes for delete using (auth.uid() = user_id);
