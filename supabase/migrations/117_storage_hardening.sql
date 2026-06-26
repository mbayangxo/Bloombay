-- Storage hardening v2 — Migration 117
-- Separates public vs private buckets, tightens RLS, extends upload_audit_logs.

-- ── PUBLIC BUCKETS ───────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880,
    array['image/jpeg','image/png','image/webp','image/gif']),
  ('club-covers', 'club-covers', true, 10485760,
    array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('event-covers', 'event-covers', true, 10485760,
    array['image/jpeg','image/png','image/webp','audio/mp4','audio/webm','audio/ogg']),
  ('city-assets', 'city-assets', true, 10485760,
    array['image/jpeg','image/png','image/webp']),
  ('brand-assets', 'brand-assets', true, 8388608,
    array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ── PRIVATE BUCKETS ──────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('government-ids', 'government-ids', false, 10485760,
    array['image/jpeg','image/png','image/webp','application/pdf']),
  ('verification-selfies', 'verification-selfies', false, 15728640,
    array['image/jpeg','image/png','image/webp']),
  ('girlmate-private', 'girlmate-private', false, 52428800,
    array['image/jpeg','image/png','image/webp','video/mp4','video/webm','audio/mp4','audio/webm','audio/ogg']),
  ('moderation-evidence', 'moderation-evidence', false, 10485760,
    array['image/jpeg','image/png','image/webp','application/pdf']),
  ('reports', 'reports', false, 10485760,
    array['image/jpeg','image/png','image/webp','video/mp4','application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Government ID storage path (private bucket reference — never a public URL)
alter table public.profiles
  add column if not exists gov_id_storage_path text;

-- ── upload_audit_logs: align with hardened schema ────────────────────────────
create table if not exists public.upload_audit_logs (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references public.profiles(id) on delete cascade,
  file_type        text,
  bucket           text        not null,
  path             text        not null,
  purpose          text        not null,
  file_size_bytes  int,
  created_at       timestamptz not null default now(),
  metadata         jsonb       not null default '{}'::jsonb
);

-- Migrate columns from migration 111 if present
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'upload_audit_logs' and column_name = 'storage_path'
  ) then
    update public.upload_audit_logs set path = storage_path where path is null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'upload_audit_logs' and column_name = 'mime_type'
  ) then
    update public.upload_audit_logs set file_type = mime_type where file_type is null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'upload_audit_logs' and column_name = 'size_bytes'
  ) then
    update public.upload_audit_logs set file_size_bytes = size_bytes::int where file_size_bytes is null;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'upload_audit_logs' and column_name = 'meta'
  ) then
    update public.upload_audit_logs set metadata = meta where metadata = '{}'::jsonb;
  end if;
end $$;

alter table public.upload_audit_logs
  add column if not exists file_type text,
  add column if not exists path text,
  add column if not exists purpose text,
  add column if not exists file_size_bytes int,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

update public.upload_audit_logs set purpose = coalesce(purpose, 'legacy') where purpose is null;
update public.upload_audit_logs set path = coalesce(path, user_id::text || '/unknown') where path is null;

create index if not exists upload_audit_logs_user_idx
  on public.upload_audit_logs(user_id, created_at desc);
create index if not exists upload_audit_logs_bucket_idx
  on public.upload_audit_logs(bucket, created_at desc);
create index if not exists upload_audit_logs_purpose_idx
  on public.upload_audit_logs(purpose, created_at desc);

alter table public.upload_audit_logs enable row level security;

drop policy if exists "Upload audit admin read" on public.upload_audit_logs;
create policy "Upload audit admin read"
  on public.upload_audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder', 'moderator')
    )
  );

-- ── Helper: owner prefix check ───────────────────────────────────────────────
-- Path must start with auth.uid()::text/

-- ── PUBLIC BUCKET POLICIES ───────────────────────────────────────────────────
-- Avatars
drop policy if exists "avatars public read v117" on storage.objects;
create policy "avatars public read v117"
  on storage.objects for select to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars auth upload own v117" on storage.objects;
create policy "avatars auth upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars auth update own v117" on storage.objects;
create policy "avatars auth update own v117"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Club covers
drop policy if exists "club-covers public read v117" on storage.objects;
create policy "club-covers public read v117"
  on storage.objects for select to public
  using (bucket_id = 'club-covers');

drop policy if exists "club-covers auth upload own v117" on storage.objects;
create policy "club-covers auth upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'club-covers' and (storage.foldername(name))[1] = auth.uid()::text);

-- Event covers
drop policy if exists "event-covers public read v117" on storage.objects;
create policy "event-covers public read v117"
  on storage.objects for select to public
  using (bucket_id = 'event-covers');

drop policy if exists "event-covers auth upload own v117" on storage.objects;
create policy "event-covers auth upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'event-covers' and (storage.foldername(name))[1] = auth.uid()::text);

-- City assets
drop policy if exists "city-assets public read v117" on storage.objects;
create policy "city-assets public read v117"
  on storage.objects for select to public
  using (bucket_id = 'city-assets');

drop policy if exists "city-assets auth upload own v117" on storage.objects;
create policy "city-assets auth upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'city-assets' and (storage.foldername(name))[1] = auth.uid()::text);

-- Brand assets
drop policy if exists "brand-assets public read v117" on storage.objects;
create policy "brand-assets public read v117"
  on storage.objects for select to public
  using (bucket_id = 'brand-assets');

drop policy if exists "brand-assets auth upload own v117" on storage.objects;
create policy "brand-assets auth upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── PRIVATE BUCKET POLICIES (no public read) ─────────────────────────────────
-- Users upload to own prefix; SELECT only via service role / signed URLs.

drop policy if exists "government-ids upload own v117" on storage.objects;
create policy "government-ids upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'government-ids' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "verification-selfies upload own v117" on storage.objects;
create policy "verification-selfies upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'verification-selfies' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "verification-selfies delete own v117" on storage.objects;
create policy "verification-selfies delete own v117"
  on storage.objects for delete to authenticated
  using (bucket_id = 'verification-selfies' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "girlmate-private upload own v117" on storage.objects;
create policy "girlmate-private upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'girlmate-private' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "reports upload own v117" on storage.objects;
create policy "reports upload own v117"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'reports' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "moderation-evidence upload staff v117" on storage.objects;
create policy "moderation-evidence upload staff v117"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'moderation-evidence'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder', 'moderator')
    )
  );

-- Staff read on private verification/gov buckets (belt-and-suspenders; service role bypasses RLS)
drop policy if exists "government-ids staff read v117" on storage.objects;
create policy "government-ids staff read v117"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'government-ids'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder', 'moderator')
    )
  );

drop policy if exists "verification-selfies staff read v117" on storage.objects;
create policy "verification-selfies staff read v117"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'verification-selfies'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder', 'moderator')
    )
  );
