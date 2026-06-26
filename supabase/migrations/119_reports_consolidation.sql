-- Reports consolidation — Migration 119
-- Canonical table: member_reports. Freeze user_reports writes.

-- ── Extend member_reports with context fields from user_reports ─────────────
alter table public.member_reports
  add column if not exists source_type text,
  add column if not exists source_id text,
  add column if not exists admin_notes text;

create index if not exists member_reports_source_idx
  on public.member_reports (source_type, source_id)
  where source_type is not null;

-- ── Backfill: copy user_reports rows missing from member_reports ────────────
-- Requires migration 103 (user_reports). Skipped safely if table never existed.
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'user_reports'
  ) then
    insert into public.member_reports (
      reporter_id,
      reported_id,
      reason,
      details,
      severity,
      status,
      source_type,
      source_id,
      admin_notes,
      created_at
    )
    select
      ur.reporter_id,
      ur.reported_id,
      ur.reason,
      ur.details,
      case
        when ur.reason in ('harassment', 'hate_speech', 'scam') then 'high'
        when ur.reason in ('inappropriate_content', 'fake_profile') then 'medium'
        else 'low'
      end,
      case
        when ur.status = 'pending' and ur.reason in ('harassment', 'hate_speech', 'scam')
          then 'human_review_required'
        else ur.status
      end,
      ur.source_type,
      ur.source_id,
      ur.admin_notes,
      ur.created_at
    from public.user_reports ur
    where not exists (
      select 1
      from public.member_reports mr
      where mr.reporter_id = ur.reporter_id
        and mr.reported_id = ur.reported_id
        and mr.created_at = ur.created_at
    );
  end if;
end $$;

-- ── Freeze user_reports: no new inserts via RLS ─────────────────────────────
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'user_reports'
  ) then
    drop policy if exists "reports_insert_own" on public.user_reports;

    create policy "user_reports_insert_frozen"
      on public.user_reports for insert
      with check (false);

    comment on table public.user_reports is
      'Legacy duplicate of member_reports. Frozen at migration 119. Read-only for audit; drop post-beta.';
  end if;
end $$;
