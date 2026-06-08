-- Storage buckets for member + club media
-- Run once in Supabase SQL editor (requires storage schema).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('club-media', 'club-media', true, 6291456, array['image/jpeg', 'image/png', 'image/webp']),
  ('member-memories', 'member-memories', true, 6291456, array['image/jpeg', 'image/png', 'image/webp']),
  ('profile-photos', 'profile-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('verification', 'verification', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Avatars: users upload to their own folder
create policy "Avatar upload own folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatar update own folder"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Avatars public read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- Club media: club owners upload under club slug folder
create policy "Club media upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'club-media');

create policy "Club media public read"
  on storage.objects for select
  to public
  using (bucket_id = 'club-media');

-- Member memories
create policy "Member memories upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'member-memories' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Member memories public read"
  on storage.objects for select
  to public
  using (bucket_id = 'member-memories');

-- Profile photos
create policy "Profile photos upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'profile-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Profile photos public read"
  on storage.objects for select
  to public
  using (bucket_id = 'profile-photos');

-- Verification (private)
create policy "Verification upload own"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Verification read own"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'verification' and (storage.foldername(name))[1] = auth.uid()::text);
