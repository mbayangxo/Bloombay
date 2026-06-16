-- Add cover photo URL to clubs table
alter table public.clubs
  add column if not exists cover_url text;

-- Storage bucket: run these in the Supabase dashboard → Storage → New bucket
-- Bucket name: club-covers  |  Public: true
-- Bucket name: avatars      |  Public: true  (may already exist)

-- RLS: club owners can update their own club's cover
drop policy if exists "Club owner can update cover" on public.clubs;
create policy "Club owner can update cover"
  on public.clubs
  for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
