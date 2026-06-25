-- Storage hardening — Migration 111
-- 1. Create buckets referenced in code but missing from migration 014
-- 2. Add admin read access to verification bucket (service role bypasses RLS
--    but explicit policy documents the intent and covers future use)
-- 3. Create upload_audit_logs table for sensitive uploads

-- ── MISSING BUCKETS ──────────────────────────────────────────────────────────
-- club-covers: club cover/banner/crest images (includes svg for crests)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('club-covers',    'club-covers',    true,  10485760,
    array['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('hanger',         'hanger',         true,   8388608,
    array['image/jpeg','image/png','image/webp']),
  ('event-media',    'event-media',    true,  10485760,
    array['image/jpeg','image/png','image/webp','audio/mp4','audio/webm','audio/ogg']),
  ('avenue-media',   'avenue-media',   true,   8388608,
    array['image/jpeg','image/png','image/webp']),
  ('girlmate-media', 'girlmate-media', true,   8388608,
    array['image/jpeg','image/png','image/webp']),
  ('media',          'media',          true,   8388608,
    array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Public read for all new public buckets
create policy "club-covers public read"
  on storage.objects for select to public
  using (bucket_id = 'club-covers');

create policy "club-covers auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'club-covers');

create policy "club-covers auth update"
  on storage.objects for update to authenticated
  using (bucket_id = 'club-covers');

create policy "hanger public read"
  on storage.objects for select to public
  using (bucket_id = 'hanger');

create policy "hanger auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'hanger');

create policy "event-media public read"
  on storage.objects for select to public
  using (bucket_id = 'event-media');

create policy "event-media auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'event-media');

create policy "avenue-media public read"
  on storage.objects for select to public
  using (bucket_id = 'avenue-media');

create policy "avenue-media auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avenue-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "girlmate-media public read"
  on storage.objects for select to public
  using (bucket_id = 'girlmate-media');

create policy "girlmate-media auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'girlmate-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "media public read"
  on storage.objects for select to public
  using (bucket_id = 'media');

create policy "media auth upload"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

-- ── VERIFICATION BUCKET: admin/founder read ──────────────────────────────────
-- Admins use the service role client which bypasses RLS entirely.
-- This policy provides belt-and-suspenders access for future anon-key admin tools.
create policy "Verification admin read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'verification'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder')
    )
  );

-- ── UPLOAD AUDIT LOGS ────────────────────────────────────────────────────────
-- Tracks sensitive uploads: verification selfies, gov IDs, moderation evidence.
create table if not exists public.upload_audit_logs (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  bucket       text        not null,
  storage_path text        not null,
  mime_type    text,
  size_bytes   bigint,
  event_type   text        not null default 'upload'
    check (event_type in ('upload', 'delete', 'replace')),
  meta         jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists upload_audit_user_idx
  on public.upload_audit_logs(user_id, created_at desc);

create index if not exists upload_audit_bucket_idx
  on public.upload_audit_logs(bucket, created_at desc);

alter table public.upload_audit_logs enable row level security;

-- Only admins/founders can query upload audit logs
create policy "Upload audit admin read"
  on public.upload_audit_logs for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'founder')
    )
  );

-- Inserts happen via service role from API routes only
