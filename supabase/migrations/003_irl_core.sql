-- BloomBay IRL core: gatherings, seats, attendance, club join (14-day funnel)

-- ─── Gatherings ───
create table if not exists public.gatherings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  starts_at timestamptz not null,
  area text,
  capacity int not null default 10 check (capacity > 0),
  spots_left int not null default 10 check (spots_left >= 0),
  club_slug text,
  created_at timestamptz not null default now()
);

create index if not exists gatherings_starts_at_idx on public.gatherings (starts_at);

-- ─── Seat reservations ───
create table if not exists public.seat_reservations (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'reserved' check (status in ('reserved', 'cancelled')),
  created_at timestamptz not null default now()
);

create unique index if not exists seat_reservations_active_unique
  on public.seat_reservations (gathering_id, user_id)
  where (status = 'reserved');

create index if not exists seat_reservations_user_idx on public.seat_reservations (user_id, created_at desc);

-- ─── IRL check-in (attended) ───
create table if not exists public.gathering_attendance (
  id uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  unique (gathering_id, user_id)
);

create index if not exists gathering_attendance_user_idx on public.gathering_attendance (user_id, checked_in_at desc);

-- ─── Club membership (joined club step) ───
create table if not exists public.club_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  club_slug text not null,
  joined_at timestamptz not null default now(),
  unique (user_id, club_slug)
);

create index if not exists club_memberships_user_idx on public.club_memberships (user_id);

-- Decrement spots when a seat is reserved
create or replace function public.on_seat_reserved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.status = 'reserved' then
    update public.gatherings
    set spots_left = greatest(0, spots_left - 1)
    where id = NEW.gathering_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists seat_reserved_decrement on public.seat_reservations;
create trigger seat_reserved_decrement
  after insert on public.seat_reservations
  for each row execute function public.on_seat_reserved();

-- ─── RLS helpers ───
create or replace function public.has_ops_role()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('founder', 'admin', 'moderator', 'curator')
  );
$$;

-- ─── RLS: gatherings ───
alter table public.gatherings enable row level security;

drop policy if exists "Gatherings read authenticated" on public.gatherings;
create policy "Gatherings read authenticated"
  on public.gatherings for select
  to authenticated
  using (true);

drop policy if exists "Gatherings ops write" on public.gatherings;
create policy "Gatherings ops write"
  on public.gatherings for all
  to authenticated
  using (public.has_ops_role())
  with check (public.has_ops_role());

-- ─── RLS: seat_reservations ───
alter table public.seat_reservations enable row level security;

drop policy if exists "Seats read own or ops" on public.seat_reservations;
create policy "Seats read own or ops"
  on public.seat_reservations for select
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

drop policy if exists "Seats insert own" on public.seat_reservations;
create policy "Seats insert own"
  on public.seat_reservations for insert
  to authenticated
  with check (user_id = auth.uid());

-- ─── RLS: gathering_attendance ───
alter table public.gathering_attendance enable row level security;

drop policy if exists "Attendance read own or ops" on public.gathering_attendance;
create policy "Attendance read own or ops"
  on public.gathering_attendance for select
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

drop policy if exists "Attendance insert own" on public.gathering_attendance;
create policy "Attendance insert own"
  on public.gathering_attendance for insert
  to authenticated
  with check (user_id = auth.uid());

-- ─── RLS: club_memberships ───
alter table public.club_memberships enable row level security;

drop policy if exists "Club memberships read own or ops" on public.club_memberships;
create policy "Club memberships read own or ops"
  on public.club_memberships for select
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

drop policy if exists "Club memberships insert own" on public.club_memberships;
create policy "Club memberships insert own"
  on public.club_memberships for insert
  to authenticated
  with check (user_id = auth.uid());

-- Demo gatherings (safe to re-run)
insert into public.gatherings (slug, title, starts_at, area, capacity, spots_left, club_slug)
values
  ('sant-ambroeus-soho', 'Sant Ambroeus', now() + interval '2 days', 'SoHo', 4, 4, 'morning-run-club'),
  ('cafe-lume-williamsburg', 'Café Lume', now() + interval '3 days', 'Williamsburg', 6, 6, 'morning-run-club'),
  ('loft-house-brooklyn', 'The Loft House', now() + interval '5 days', 'Brooklyn', 12, 12, 'morning-run-club')
on conflict (slug) do nothing;
