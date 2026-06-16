-- Fix club creation for regular members.
-- Safe to run even if 003_clubs_fields.sql was already applied.

-- 1. Ensure every column the create-club form writes to actually exists
alter table public.clubs
  add column if not exists emoji            text default '🌸',
  add column if not exists category         text,
  add column if not exists neighborhood     text,
  add column if not exists frequency        text,
  add column if not exists capacity         text,
  add column if not exists membership_type  text default 'open',
  add column if not exists cover_url        text;

-- 2. Replace the admin-only insert policy with one that allows any
--    authenticated member to create a club they own.
drop policy if exists "clubs_insert_admin"  on public.clubs;
drop policy if exists "clubs_insert_member" on public.clubs;

create policy "clubs_insert_member" on public.clubs
  for insert with check (auth.uid() is not null and owner_id = auth.uid());
