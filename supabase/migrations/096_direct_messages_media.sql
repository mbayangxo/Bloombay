-- Chat media: photos + voice notes + gifs on direct_messages + storage bucket

alter table public.direct_messages
  add column if not exists media_url text;

alter table public.direct_messages
  add column if not exists media_type text;

update public.direct_messages
set media_type = 'text'
where media_type is null;

alter table public.direct_messages
  alter column media_type set default 'text';

alter table public.direct_messages
  alter column media_type set not null;

alter table public.direct_messages
  drop constraint if exists direct_messages_media_type_check;

alter table public.direct_messages
  add constraint direct_messages_media_type_check
  check (media_type in ('text', 'image', 'audio', 'gif'));

comment on column public.direct_messages.media_url is 'Public storage URL for image/audio/gif attachments';
comment on column public.direct_messages.media_type is 'text | image | audio | gif';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-media',
  'chat-media',
  true,
  10485760,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/x-m4a', 'audio/aac'
  ]
)
on conflict (id) do nothing;

drop policy if exists "Chat media upload own folder" on storage.objects;
create policy "Chat media upload own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'chat-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Chat media update own folder" on storage.objects;
create policy "Chat media update own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'chat-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Chat media public read" on storage.objects;
create policy "Chat media public read"
  on storage.objects for select
  to public
  using (bucket_id = 'chat-media');

drop policy if exists "Chat media delete own folder" on storage.objects;
create policy "Chat media delete own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'chat-media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
