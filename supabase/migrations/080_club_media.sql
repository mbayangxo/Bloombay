-- Club media: photos and voice notes added by members
create table if not exists club_media (
  id            uuid primary key default gen_random_uuid(),
  club_id       uuid not null references clubs(id) on delete cascade,
  user_id       uuid not null references profiles(id) on delete cascade,
  media_type    text not null check (media_type in ('photo', 'voice_note')),
  storage_path  text not null,
  public_url    text not null,
  caption       text,
  duration_ms   int,           -- voice notes only, milliseconds
  width         int,           -- photos only
  height        int,           -- photos only
  taken_at      timestamptz,   -- EXIF date if available
  created_at    timestamptz not null default now()
);

create index if not exists club_media_club_id_idx on club_media(club_id, created_at desc);
create index if not exists club_media_user_id_idx on club_media(user_id);

alter table club_media enable row level security;

-- Anyone can view photos from clubs they're a member of
create policy "members can view club media"
  on club_media for select
  using (
    exists (
      select 1 from club_memberships cm
      join clubs c on c.slug = cm.club_slug
      where c.id = club_media.club_id
        and cm.user_id = auth.uid()
    )
    or
    exists (
      select 1 from clubs c
      where c.id = club_media.club_id
        and c.owner_id = auth.uid()
    )
  );

-- Members can upload their own media
create policy "members can insert club media"
  on club_media for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from club_memberships cm
      join clubs c on c.slug = cm.club_slug
      where c.id = club_media.club_id
        and cm.user_id = auth.uid()
    )
  );

-- Users can delete their own uploads; club owners can delete any
create policy "users can delete own media"
  on club_media for delete
  using (
    user_id = auth.uid()
    or exists (
      select 1 from clubs c
      where c.id = club_media.club_id
        and c.owner_id = auth.uid()
    )
  );
