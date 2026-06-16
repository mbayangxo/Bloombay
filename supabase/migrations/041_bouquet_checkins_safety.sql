-- ── Missing: club_memberships RLS policies ────────────────────────────────────
-- RLS was enabled in migration 024 but policies were never written.

drop policy if exists "memberships_read_all" on public.club_memberships;
create policy "memberships_read_all"
  on public.club_memberships for select using (true);

drop policy if exists "memberships_join" on public.club_memberships;
create policy "memberships_join"
  on public.club_memberships for insert
  with check (auth.uid() = user_id);

drop policy if exists "memberships_leave" on public.club_memberships;
create policy "memberships_leave"
  on public.club_memberships for delete
  using (auth.uid() = user_id);


-- ── Bloom Bouquet: a woman's inner circle (up to 12) ─────────────────────────
-- These are the women who get pinged when she activates Bloom Safe Mode.

create table if not exists public.bloom_bouquet (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null references public.profiles(id) on delete cascade,
  member_id  uuid not null references public.profiles(id) on delete cascade,
  position   smallint not null default 0,     -- display order 0–11
  added_at   timestamptz not null default now(),
  unique (owner_id, member_id),
  check (position between 0 and 11)           -- max 12 slots
);

create index if not exists bouquet_owner_idx on public.bloom_bouquet(owner_id, position);

alter table public.bloom_bouquet enable row level security;

create policy "bouquet_read_own"
  on public.bloom_bouquet for select
  using (auth.uid() = owner_id);

create policy "bouquet_add"
  on public.bloom_bouquet for insert
  with check (auth.uid() = owner_id);

create policy "bouquet_remove"
  on public.bloom_bouquet for delete
  using (auth.uid() = owner_id);

create policy "bouquet_reorder"
  on public.bloom_bouquet for update
  using (auth.uid() = owner_id);


-- ── Safety Pings: silent signals to bouquet members ───────────────────────────
-- When a woman taps "Ping my bouquet", every bouquet member gets a notification.
-- No alarm. No text. Just a quiet "check on her" signal between women.

create table if not exists public.safety_pings (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'sent'
    check (status in ('sent','seen','responded')),
  event_name   text,           -- optional: which event she's at
  created_at   timestamptz not null default now()
);

create index if not exists pings_recipient_idx on public.safety_pings(recipient_id, created_at desc);
create index if not exists pings_sender_idx    on public.safety_pings(sender_id,    created_at desc);

alter table public.safety_pings enable row level security;

create policy "pings_read_own"
  on public.safety_pings for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

create policy "pings_send"
  on public.safety_pings for insert
  with check (auth.uid() = sender_id);

create policy "pings_update_recipient"
  on public.safety_pings for update
  using (auth.uid() = recipient_id);


-- ── Event Check-ins: scanning into BloomBay gatherings ────────────────────────
-- QR code scan at venue check-in. Records arrival time.
-- Also used for "met a Bloomie at this event" friend scans.

create table if not exists public.event_checkins (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.gatherings(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  method       text not null default 'qr'
    check (method in ('qr','manual','host')),
  unique (event_id, user_id)
);

create index if not exists checkins_event_idx on public.event_checkins(event_id);
create index if not exists checkins_user_idx  on public.event_checkins(user_id, checked_in_at desc);

alter table public.event_checkins enable row level security;

create policy "checkins_read_event"
  on public.event_checkins for select
  using (true);                               -- anyone at the event can see who checked in

create policy "checkins_own"
  on public.event_checkins for insert
  with check (auth.uid() = user_id);

create policy "checkins_delete_own"
  on public.event_checkins for delete
  using (auth.uid() = user_id);


-- ── Friend Scans: "I just met her" at an event ────────────────────────────────
-- When two women scan each other at an event, this creates a mutual record.
-- Yande uses this to surface "you met 3 new Bloomies" in the monthly recap.

create table if not exists public.friend_scans (
  id           uuid primary key default gen_random_uuid(),
  initiator_id uuid not null references public.profiles(id) on delete cascade,
  scanned_id   uuid not null references public.profiles(id) on delete cascade,
  event_id     uuid references public.gatherings(id) on delete set null,
  scanned_at   timestamptz not null default now(),
  unique (initiator_id, scanned_id, event_id)
);

create index if not exists scans_initiator_idx on public.friend_scans(initiator_id, scanned_at desc);
create index if not exists scans_scanned_idx   on public.friend_scans(scanned_id,   scanned_at desc);

alter table public.friend_scans enable row level security;

create policy "scans_read_own"
  on public.friend_scans for select
  using (auth.uid() = initiator_id or auth.uid() = scanned_id);

create policy "scans_write_own"
  on public.friend_scans for insert
  with check (auth.uid() = initiator_id);
