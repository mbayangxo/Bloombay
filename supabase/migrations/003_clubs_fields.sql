-- Add missing fields collected by the create-club form
alter table public.clubs
  add column if not exists emoji            text default '🌸',
  add column if not exists category         text,
  add column if not exists neighborhood     text,
  add column if not exists frequency        text,
  add column if not exists capacity         text,
  add column if not exists membership_type  text default 'open';

-- Allow any authenticated member to create their own club
-- (previous policy was restricted to admin/founder only)
drop policy if exists "clubs_insert_admin" on public.clubs;
create policy "clubs_insert_member" on public.clubs for insert
  with check (auth.uid() is not null and owner_id = auth.uid());
