-- DM chat can send photos, voice notes, and gifs but not video — add it as
-- a real media type so "send them videos" actually works end to end.
alter table public.direct_messages
  drop constraint if exists direct_messages_media_type_check;

alter table public.direct_messages
  add constraint direct_messages_media_type_check
  check (media_type in ('text', 'image', 'audio', 'gif', 'video'));

comment on column public.direct_messages.media_type is 'text | image | audio | gif | video';
