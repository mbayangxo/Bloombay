-- Profile photo gallery
create table if not exists public.profile_photos (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  url        text not null,
  caption    text
);

alter table public.profile_photos enable row level security;

-- Any authenticated user can view profile photos (social visibility)
create policy "Authenticated users can view profile photos"
  on public.profile_photos for select
  using (auth.role() = 'authenticated');

-- Users can only insert their own photos
create policy "Users can insert own profile photos"
  on public.profile_photos for insert
  with check (user_id = auth.uid());

-- Users can only delete their own photos
create policy "Users can delete own profile photos"
  on public.profile_photos for delete
  using (user_id = auth.uid());

-- Storage bucket: create in Supabase dashboard → Storage → New bucket
-- Bucket name: profile-photos  |  Public: true
