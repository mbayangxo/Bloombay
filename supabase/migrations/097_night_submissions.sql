-- Night submissions: Eventbrite pulls + member "Submit a night" → approve → gatherings (Happenings)

create table if not exists public.night_submissions (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  starts_at       timestamptz,
  venue           text,
  neighborhood    text,
  city            text not null default 'New York',
  image_url       text,
  external_url    text,
  external_source text not null default 'manual'
    check (external_source in ('eventbrite', 'manual', 'luma', 'partiful', 'other')),
  external_id     text,
  category        text not null default 'event'
    check (category in ('dining','drinks','pop-up','art','nightlife','brunch','coffee','shopping','wellness','event','other')),
  aesthetic_score smallint,
  aesthetic_note  text,
  status          text not null default 'pending'
    check (status in ('pending','approved','rejected')),
  submitted_by    uuid references public.profiles(id) on delete set null,
  reviewed_by     uuid references public.profiles(id) on delete set null,
  reviewed_at     timestamptz,
  gathering_id    uuid references public.gatherings(id) on delete set null,
  reject_reason   text,
  created_at      timestamptz not null default now(),
  unique (external_source, external_id)
);

create index if not exists night_submissions_status_idx
  on public.night_submissions (status, starts_at nulls last);

create index if not exists night_submissions_source_idx
  on public.night_submissions (external_source, created_at desc);

alter table public.night_submissions enable row level security;

-- Members can read their own submissions
drop policy if exists "nights_read_own" on public.night_submissions;
create policy "nights_read_own"
  on public.night_submissions for select
  using (
    auth.uid() = submitted_by
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder','curator')
    )
  );

-- Any authenticated member can submit a night (manual)
drop policy if exists "nights_member_submit" on public.night_submissions;
create policy "nights_member_submit"
  on public.night_submissions for insert
  with check (
    auth.uid() = submitted_by
    and external_source = 'manual'
    and status = 'pending'
  );

-- Founders/admins/curators can update (approve/reject)
drop policy if exists "nights_manage" on public.night_submissions;
create policy "nights_manage"
  on public.night_submissions for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder','curator')
    )
  );

comment on table public.night_submissions is
  'Staging queue for external + member-submitted nights before they become Happenings gatherings';
