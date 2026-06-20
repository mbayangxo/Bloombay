-- BloomBay Phase 1: truthful member actions (all writes land here)

-- Link prototype event ids (g1, g2) to IRL gatherings
alter table public.gatherings
  add column if not exists event_key text unique,
  add column if not exists created_by uuid references auth.users (id) on delete set null,
  add column if not exists venue text,
  add column if not exists neighborhood text;

update public.gatherings set event_key = 'g1' where slug = 'sant-ambroeus-soho' and event_key is null;
update public.gatherings set event_key = 'g2' where slug = 'cafe-lume-williamsburg' and event_key is null;

-- Members can create open seats (gatherings)
drop policy if exists "Gatherings member create" on public.gatherings;
create policy "Gatherings member create"
  on public.gatherings for insert
  to authenticated
  with check (created_by = auth.uid());

-- ─── Bloom requests (Connect / match) ───
create table if not exists public.bloom_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users (id) on delete cascade,
  to_user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  context text,
  note text,
  compatibility_score int check (compatibility_score is null or (compatibility_score >= 0 and compatibility_score <= 100)),
  created_at timestamptz not null default now(),
  responded_at timestamptz
);

create index if not exists bloom_requests_to_idx on public.bloom_requests (to_user_id, status, created_at desc);
create index if not exists bloom_requests_from_idx on public.bloom_requests (from_user_id, created_at desc);

-- ─── Club applications ───
create table if not exists public.club_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  club_slug text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied')),
  applicant_name text not null,
  city text,
  instagram text,
  why text not null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create unique index if not exists club_applications_pending_unique
  on public.club_applications (user_id, club_slug)
  where (status = 'pending');

-- ─── Girl calendar ───
create table if not exists public.member_calendar_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  source_id text not null,
  title text not null,
  when_label text not null,
  place text,
  href text not null,
  kind text not null check (kind in ('happening', 'seat', 'partner', 'gem', 'solo')),
  remind boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, source_id)
);

create index if not exists member_calendar_user_idx on public.member_calendar_plans (user_id, created_at desc);

-- ─── Stamps (vault / club energy) ───
create table if not exists public.member_stamps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  club_slug text,
  gathering_id uuid references public.gatherings (id) on delete set null,
  earned_at timestamptz not null default now()
);

create index if not exists member_stamps_user_idx on public.member_stamps (user_id, earned_at desc);

-- ─── Witnesses (IRL attestation — she showed up) ───
create table if not exists public.gathering_witnesses (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  witness_user_id uuid not null references auth.users (id) on delete cascade,
  subject_user_id uuid not null references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  unique (gathering_id, witness_user_id, subject_user_id)
);

-- ─── Member preferences (mood + Phase 3 Yande memory seed) ───
create table if not exists public.member_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  discovery_mood text,
  updated_at timestamptz not null default now()
);

-- ─── Behavior signals (Phase 3 Yande memory) ───
create table if not exists public.member_behavior_signals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  signal_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists member_behavior_signals_user_idx
  on public.member_behavior_signals (user_id, created_at desc);

-- ─── RLS: bloom_requests ───
alter table public.bloom_requests enable row level security;

create policy "Bloom requests read involved"
  on public.bloom_requests for select to authenticated
  using (from_user_id = auth.uid() or to_user_id = auth.uid() or public.has_ops_role());

create policy "Bloom requests insert own"
  on public.bloom_requests for insert to authenticated
  with check (from_user_id = auth.uid());

create policy "Bloom requests update recipient"
  on public.bloom_requests for update to authenticated
  using (to_user_id = auth.uid() or from_user_id = auth.uid() or public.has_ops_role());

-- ─── RLS: club_applications ───
alter table public.club_applications enable row level security;

create policy "Club applications read own or ops"
  on public.club_applications for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy "Club applications insert own"
  on public.club_applications for insert to authenticated
  with check (user_id = auth.uid());

-- ─── RLS: calendar ───
alter table public.member_calendar_plans enable row level security;

create policy "Calendar read own"
  on public.member_calendar_plans for select to authenticated
  using (user_id = auth.uid());

create policy "Calendar write own"
  on public.member_calendar_plans for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ─── RLS: stamps ───
alter table public.member_stamps enable row level security;

create policy "Stamps read own or ops"
  on public.member_stamps for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy "Stamps insert own"
  on public.member_stamps for insert to authenticated
  with check (user_id = auth.uid());

-- ─── RLS: witnesses ───
alter table public.gathering_witnesses enable row level security;

create policy "Witnesses read authenticated"
  on public.gathering_witnesses for select to authenticated
  using (witness_user_id = auth.uid() or subject_user_id = auth.uid() or public.has_ops_role());

create policy "Witnesses insert own"
  on public.gathering_witnesses for insert to authenticated
  with check (witness_user_id = auth.uid());

-- ─── RLS: preferences + behavior ───
alter table public.member_preferences enable row level security;
alter table public.member_behavior_signals enable row level security;

create policy "Preferences own"
  on public.member_preferences for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Behavior signals own read"
  on public.member_behavior_signals for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy "Behavior signals own insert"
  on public.member_behavior_signals for insert to authenticated
  with check (user_id = auth.uid());
