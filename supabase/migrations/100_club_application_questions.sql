-- 100_club_application_questions.sql
-- Lets a Club Mama write her own custom application questions, and lets
-- applicants attach a photo with their application. Neither existed before
-- this (club_applications had a single fixed set of fields for every club,
-- and no photo field at all).

create table if not exists public.club_application_questions (
  id         uuid primary key default gen_random_uuid(),
  club_slug  text not null,
  question   text not null,
  required   boolean not null default false,
  position   int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists club_application_questions_club_idx
  on public.club_application_questions (club_slug, position);

alter table public.club_application_questions enable row level security;

-- Applicants need to read a club's questions to render the apply form.
create policy "Club application questions public read"
  on public.club_application_questions for select
  using (true);

-- Only the club's owner can add/edit/remove her own questions.
create policy "Club application questions owner manage"
  on public.club_application_questions for all
  to authenticated
  using (club_slug in (select slug from public.clubs where owner_id = auth.uid()))
  with check (club_slug in (select slug from public.clubs where owner_id = auth.uid()));

alter table public.club_applications
  add column if not exists photo_url text,
  add column if not exists answers jsonb;
