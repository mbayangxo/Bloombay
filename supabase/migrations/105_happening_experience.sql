-- Real backing for the fuller happening-detail / RSVP-confirmation /
-- plan-room experience: table+seat assignment, deposit/fee pricing, dress
-- code, RSVP deadline, per-attendee voice notes, outfit-check photos with
-- reactions, and a pre-order menu. All additive — existing free gatherings
-- are unaffected (deposit_cents/experience_fee_cents/venue_fee_cents default
-- to 0, table_size defaults to 8).

-- ─── Gatherings: pricing, table size, dress code, RSVP deadline ───
alter table public.gatherings add column if not exists table_size int not null default 8 check (table_size > 0);
alter table public.gatherings add column if not exists deposit_cents int not null default 0 check (deposit_cents >= 0);
alter table public.gatherings add column if not exists experience_fee_cents int not null default 0 check (experience_fee_cents >= 0);
alter table public.gatherings add column if not exists venue_fee_cents int not null default 0 check (venue_fee_cents >= 0);
alter table public.gatherings add column if not exists dress_code text;
alter table public.gatherings add column if not exists rsvp_deadline timestamptz;

-- A host could previously never update their own gathering after creation
-- (only has_ops_role() could write) — the host media-upload PATCH endpoint
-- (app/api/gatherings/[id]/media/route.ts) has been silently no-op-ing
-- against RLS. Fixing this here since dress code / table size / menu setup
-- all need the same grant.
drop policy if exists "Gatherings host update own" on public.gatherings;
create policy "Gatherings host update own"
  on public.gatherings for update
  to authenticated
  using (created_by = auth.uid() or host_id = auth.uid() or public.has_ops_role())
  with check (created_by = auth.uid() or host_id = auth.uid() or public.has_ops_role());

-- ─── Seat reservations: seat + table assignment ───
alter table public.seat_reservations add column if not exists seat_number int;
alter table public.seat_reservations add column if not exists table_number int;

-- Recompute seat/table assignment and decrement spots atomically. Locks the
-- gatherings row first, which also closes the pre-existing spots_left race
-- (the old version read-then-wrote spots_left with no lock).
create or replace function public.on_seat_reserved()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  g_table_size int;
  seat_n int;
begin
  if NEW.status = 'reserved' then
    select table_size into g_table_size
    from public.gatherings
    where id = NEW.gathering_id
    for update;

    select count(*) into seat_n
    from public.seat_reservations
    where gathering_id = NEW.gathering_id and status = 'reserved';

    update public.seat_reservations
    set seat_number = seat_n,
        table_number = ceil(seat_n::numeric / greatest(coalesce(g_table_size, 8), 1))::int
    where id = NEW.id;

    update public.gatherings
    set spots_left = greatest(0, spots_left - 1)
    where id = NEW.gathering_id;
  end if;
  return NEW;
end;
$$;

-- ─── Attendee visibility helper ───
-- Lets attendees of the same gathering see each other's reservation row
-- (needed for "who's coming", chemistry preview, voice notes, outfit check)
-- without opening seat data to non-attendees.
create or replace function public.is_gathering_attendee(p_gathering_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.seat_reservations
    where gathering_id = p_gathering_id and user_id = p_user_id and status = 'reserved'
  );
$$;

drop policy if exists "Seats read own or ops" on public.seat_reservations;
drop policy if exists "Seats read own, co-attendee, or ops" on public.seat_reservations;
create policy "Seats read own, co-attendee, or ops"
  on public.seat_reservations for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.has_ops_role()
    or public.is_gathering_attendee(gathering_id, auth.uid())
  );

-- ─── Voice notes: attendees leaving short audio notes on a gathering ───
create table if not exists public.gathering_voice_notes (
  id            uuid primary key default gen_random_uuid(),
  gathering_id  uuid not null references public.gatherings (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  audio_url     text not null,
  duration_secs int not null default 0 check (duration_secs >= 0 and duration_secs <= 60),
  created_at    timestamptz not null default now()
);

create index if not exists gathering_voice_notes_gathering_idx on public.gathering_voice_notes (gathering_id, created_at desc);

alter table public.gathering_voice_notes enable row level security;

drop policy if exists "Voice notes read attendee or ops" on public.gathering_voice_notes;
create policy "Voice notes read attendee or ops"
  on public.gathering_voice_notes for select
  to authenticated
  using (public.is_gathering_attendee(gathering_id, auth.uid()) or public.has_ops_role());

drop policy if exists "Voice notes insert own if attendee" on public.gathering_voice_notes;
create policy "Voice notes insert own if attendee"
  on public.gathering_voice_notes for insert
  to authenticated
  with check (user_id = auth.uid() and public.is_gathering_attendee(gathering_id, auth.uid()));

drop policy if exists "Voice notes delete own" on public.gathering_voice_notes;
create policy "Voice notes delete own"
  on public.gathering_voice_notes for delete
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

-- ─── Outfit check: an attendee shares one outfit photo, others react ───
create table if not exists public.gathering_outfit_photos (
  id           uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  photo_url    text not null,
  created_at   timestamptz not null default now(),
  unique (gathering_id, user_id)
);

create index if not exists gathering_outfit_photos_gathering_idx on public.gathering_outfit_photos (gathering_id, created_at desc);

alter table public.gathering_outfit_photos enable row level security;

drop policy if exists "Outfit photos read attendee or ops" on public.gathering_outfit_photos;
create policy "Outfit photos read attendee or ops"
  on public.gathering_outfit_photos for select
  to authenticated
  using (public.is_gathering_attendee(gathering_id, auth.uid()) or public.has_ops_role());

drop policy if exists "Outfit photos insert own if attendee" on public.gathering_outfit_photos;
create policy "Outfit photos insert own if attendee"
  on public.gathering_outfit_photos for insert
  to authenticated
  with check (user_id = auth.uid() and public.is_gathering_attendee(gathering_id, auth.uid()));

drop policy if exists "Outfit photos update own" on public.gathering_outfit_photos;
create policy "Outfit photos update own"
  on public.gathering_outfit_photos for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Outfit photos delete own" on public.gathering_outfit_photos;
create policy "Outfit photos delete own"
  on public.gathering_outfit_photos for delete
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create table if not exists public.gathering_outfit_votes (
  id         uuid primary key default gen_random_uuid(),
  photo_id   uuid not null references public.gathering_outfit_photos (id) on delete cascade,
  voter_id   uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (photo_id, voter_id)
);

create index if not exists gathering_outfit_votes_photo_idx on public.gathering_outfit_votes (photo_id);

alter table public.gathering_outfit_votes enable row level security;

drop policy if exists "Outfit votes read attendee or ops" on public.gathering_outfit_votes;
create policy "Outfit votes read attendee or ops"
  on public.gathering_outfit_votes for select
  to authenticated
  using (
    public.has_ops_role()
    or exists (
      select 1 from public.gathering_outfit_photos p
      where p.id = photo_id and public.is_gathering_attendee(p.gathering_id, auth.uid())
    )
  );

drop policy if exists "Outfit votes insert own if attendee" on public.gathering_outfit_votes;
create policy "Outfit votes insert own if attendee"
  on public.gathering_outfit_votes for insert
  to authenticated
  with check (
    voter_id = auth.uid()
    and exists (
      select 1 from public.gathering_outfit_photos p
      where p.id = photo_id and public.is_gathering_attendee(p.gathering_id, auth.uid())
    )
  );

drop policy if exists "Outfit votes delete own" on public.gathering_outfit_votes;
create policy "Outfit votes delete own"
  on public.gathering_outfit_votes for delete
  to authenticated
  using (voter_id = auth.uid());

-- ─── Pre-order: host-defined menu, attendee intent-to-order ───
-- Orders are fulfilled/billed by the host at the event — this is a real,
-- host-visible order queue, not a live charge (the host doesn't have a
-- per-order Stripe flow wired up yet).
create table if not exists public.gathering_menu_items (
  id           uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  name         text not null,
  category     text not null default 'drink' check (category in ('drink', 'food', 'extra')),
  price_cents  int not null default 0 check (price_cents >= 0),
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists gathering_menu_items_gathering_idx on public.gathering_menu_items (gathering_id, sort_order);

alter table public.gathering_menu_items enable row level security;

drop policy if exists "Menu items read authenticated" on public.gathering_menu_items;
create policy "Menu items read authenticated"
  on public.gathering_menu_items for select
  to authenticated
  using (true);

drop policy if exists "Menu items write host or ops" on public.gathering_menu_items;
create policy "Menu items write host or ops"
  on public.gathering_menu_items for all
  to authenticated
  using (
    public.has_ops_role()
    or exists (select 1 from public.gatherings g where g.id = gathering_id and (g.host_id = auth.uid() or g.created_by = auth.uid()))
  )
  with check (
    public.has_ops_role()
    or exists (select 1 from public.gatherings g where g.id = gathering_id and (g.host_id = auth.uid() or g.created_by = auth.uid()))
  );

create table if not exists public.gathering_orders (
  id           uuid primary key default gen_random_uuid(),
  gathering_id uuid not null references public.gatherings (id) on delete cascade,
  user_id      uuid not null references auth.users (id) on delete cascade,
  item_id      uuid not null references public.gathering_menu_items (id) on delete cascade,
  quantity     int not null default 1 check (quantity > 0),
  status       text not null default 'requested' check (status in ('requested', 'confirmed', 'cancelled')),
  created_at   timestamptz not null default now(),
  unique (gathering_id, user_id, item_id)
);

create index if not exists gathering_orders_gathering_idx on public.gathering_orders (gathering_id);

alter table public.gathering_orders enable row level security;

drop policy if exists "Orders read own or host or ops" on public.gathering_orders;
create policy "Orders read own or host or ops"
  on public.gathering_orders for select
  to authenticated
  using (
    user_id = auth.uid()
    or public.has_ops_role()
    or exists (select 1 from public.gatherings g where g.id = gathering_id and (g.host_id = auth.uid() or g.created_by = auth.uid()))
  );

drop policy if exists "Orders insert own if attendee" on public.gathering_orders;
create policy "Orders insert own if attendee"
  on public.gathering_orders for insert
  to authenticated
  with check (user_id = auth.uid() and public.is_gathering_attendee(gathering_id, auth.uid()));

drop policy if exists "Orders update own or host or ops" on public.gathering_orders;
create policy "Orders update own or host or ops"
  on public.gathering_orders for update
  to authenticated
  using (
    user_id = auth.uid()
    or public.has_ops_role()
    or exists (select 1 from public.gatherings g where g.id = gathering_id and (g.host_id = auth.uid() or g.created_by = auth.uid()))
  )
  with check (
    user_id = auth.uid()
    or public.has_ops_role()
    or exists (select 1 from public.gatherings g where g.id = gathering_id and (g.host_id = auth.uid() or g.created_by = auth.uid()))
  );

drop policy if exists "Orders delete own" on public.gathering_orders;
create policy "Orders delete own"
  on public.gathering_orders for delete
  to authenticated
  using (user_id = auth.uid() or public.has_ops_role());
