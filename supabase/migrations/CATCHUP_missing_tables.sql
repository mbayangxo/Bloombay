-- ─────────────────────────────────────────────────────────────────────────────
-- CATCHUP_missing_tables.sql
-- Catch-up migration: creates all tables from RUN_ALL_030_to_056.sql that are
-- NOT already present in the database.
-- Uses CREATE TABLE IF NOT EXISTS + DROP POLICY IF EXISTS throughout.
-- NO triggers included.
-- ─────────────────────────────────────────────────────────────────────────────


-- ── bloom_notes ───────────────────────────────────────────────────────────────
-- Little notes women leave behind at places — separate from reviews.
-- bloom_note_flowers and bloom_note_saves depend on this, so it goes first.

create table if not exists public.bloom_notes (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  place_slug  text not null,
  place_name  text,
  content     text not null,
  created_at  timestamptz not null default now()
);

alter table public.bloom_notes enable row level security;

drop policy if exists "notes_read_all" on public.bloom_notes;
create policy "notes_read_all"
  on public.bloom_notes for select using (true);

drop policy if exists "notes_insert_own" on public.bloom_notes;
create policy "notes_insert_own"
  on public.bloom_notes for insert with check (auth.uid() = author_id);

drop policy if exists "notes_delete_own" on public.bloom_notes;
create policy "notes_delete_own"
  on public.bloom_notes for delete using (auth.uid() = author_id);

create index if not exists bloom_notes_place_idx  on public.bloom_notes(place_slug, created_at desc);
create index if not exists bloom_notes_author_idx on public.bloom_notes(author_id, created_at desc);


-- ── bloom_note_flowers ────────────────────────────────────────────────────────

create table if not exists public.bloom_note_flowers (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

alter table public.bloom_note_flowers enable row level security;

drop policy if exists "flowers_read_all" on public.bloom_note_flowers;
create policy "flowers_read_all"
  on public.bloom_note_flowers for select using (true);

drop policy if exists "flowers_give_own" on public.bloom_note_flowers;
create policy "flowers_give_own"
  on public.bloom_note_flowers for insert with check (auth.uid() = user_id);

drop policy if exists "flowers_take_back_own" on public.bloom_note_flowers;
create policy "flowers_take_back_own"
  on public.bloom_note_flowers for delete using (auth.uid() = user_id);


-- ── bloom_note_saves ──────────────────────────────────────────────────────────

create table if not exists public.bloom_note_saves (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

alter table public.bloom_note_saves enable row level security;

drop policy if exists "saves_read_own" on public.bloom_note_saves;
create policy "saves_read_own"
  on public.bloom_note_saves for select using (auth.uid() = user_id);

drop policy if exists "saves_insert_own" on public.bloom_note_saves;
create policy "saves_insert_own"
  on public.bloom_note_saves for insert with check (auth.uid() = user_id);

drop policy if exists "saves_delete_own" on public.bloom_note_saves;
create policy "saves_delete_own"
  on public.bloom_note_saves for delete using (auth.uid() = user_id);

create index if not exists note_saves_user_idx on public.bloom_note_saves(user_id, created_at desc);


-- ── bloom_note_tags ───────────────────────────────────────────────────────────
-- Structured insight tags for bloom notes.

create table if not exists public.bloom_note_tags (
  note_id  uuid not null references public.bloom_notes(id) on delete cascade,
  tag      text not null check (tag in (
    'solo_friendly',
    'group_vibes',
    'laptop_friendly',
    'first_date',
    'meet_people',
    'worth_it',
    'romantic',
    'special_occasion'
  )),
  primary key (note_id, tag)
);

alter table public.bloom_note_tags enable row level security;

drop policy if exists "note_tags_read_all" on public.bloom_note_tags;
create policy "note_tags_read_all"
  on public.bloom_note_tags for select using (true);

drop policy if exists "note_tags_insert_own" on public.bloom_note_tags;
create policy "note_tags_insert_own"
  on public.bloom_note_tags for insert
  with check (
    auth.uid() = (select author_id from public.bloom_notes where id = note_id)
  );

drop policy if exists "note_tags_delete_own" on public.bloom_note_tags;
create policy "note_tags_delete_own"
  on public.bloom_note_tags for delete
  using (
    auth.uid() = (select author_id from public.bloom_notes where id = note_id)
  );

create index if not exists bloom_note_tags_note_idx on public.bloom_note_tags(note_id);
create index if not exists bloom_note_tags_tag_idx  on public.bloom_note_tags(tag);


-- ── event_waitlist ────────────────────────────────────────────────────────────
-- Women who want in when an event is full.

create table if not exists public.event_waitlist (
  id         uuid primary key default gen_random_uuid(),
  event_id   text not null,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

alter table public.event_waitlist enable row level security;

drop policy if exists "waitlist_read_all" on public.event_waitlist;
create policy "waitlist_read_all" on public.event_waitlist for select using (true);

drop policy if exists "waitlist_join" on public.event_waitlist;
create policy "waitlist_join" on public.event_waitlist for insert with check (auth.uid() = user_id);

drop policy if exists "waitlist_leave" on public.event_waitlist;
create policy "waitlist_leave" on public.event_waitlist for delete using (auth.uid() = user_id);

create index if not exists waitlist_event_idx on public.event_waitlist(event_id, created_at);
create index if not exists waitlist_user_idx  on public.event_waitlist(user_id);


-- ── event_witnesses ───────────────────────────────────────────────────────────
-- After an event, tag who you met.

create table if not exists public.event_witnesses (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null,
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id   uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (event_id, from_user_id, to_user_id),
  check (from_user_id <> to_user_id)
);

alter table public.event_witnesses enable row level security;

drop policy if exists "witnesses_read_all" on public.event_witnesses;
create policy "witnesses_read_all"  on public.event_witnesses for select using (true);

drop policy if exists "witnesses_write_own" on public.event_witnesses;
create policy "witnesses_write_own" on public.event_witnesses for insert with check (auth.uid() = from_user_id);

drop policy if exists "witnesses_delete_own" on public.event_witnesses;
create policy "witnesses_delete_own" on public.event_witnesses for delete using (auth.uid() = from_user_id);

create index if not exists witnesses_event_idx   on public.event_witnesses(event_id);
create index if not exists witnesses_to_user_idx on public.event_witnesses(to_user_id);


-- ── girlmate_profiles ─────────────────────────────────────────────────────────
-- Roommate/apartment search profiles.

create table if not exists public.girlmate_profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  neighborhoods     text[] not null default '{}',
  budget_min        integer,
  budget_max        integer,
  move_in_date      date,
  bio               text,
  lifestyle_tags    text[] default '{}',
  pets              boolean default false,
  smoking           boolean default false,
  is_active         boolean default true,
  created_at        timestamptz not null default now(),
  -- extended columns (added in later migration)
  display_name      text,
  listing_type      text not null default 'roommate-wanted'
    check (listing_type in ('room','apartment','roommate-wanted','co-search')),
  city              text not null default 'New York',
  neighborhood_name text,
  price_cents       integer,
  available_from    date,
  available_to      date,
  furnished         boolean default false,
  private_bathroom  boolean default false,
  weed_ok           boolean default false,
  halal_kitchen     boolean default false,
  wfh_friendly      boolean default false,
  partner_ok        boolean default false,
  show_profile      boolean default true,
  description       text,
  yande_note        text,
  image_url         text,
  unique (user_id)
);

alter table public.girlmate_profiles enable row level security;

drop policy if exists "girlmate_read_active" on public.girlmate_profiles;
create policy "girlmate_read_active" on public.girlmate_profiles for select using (is_active = true);

drop policy if exists "girlmate_write_own" on public.girlmate_profiles;
create policy "girlmate_write_own"   on public.girlmate_profiles for insert with check (auth.uid() = user_id);

drop policy if exists "girlmate_update_own" on public.girlmate_profiles;
create policy "girlmate_update_own"  on public.girlmate_profiles for update using (auth.uid() = user_id);

drop policy if exists "girlmate_delete_own" on public.girlmate_profiles;
create policy "girlmate_delete_own"  on public.girlmate_profiles for delete using (auth.uid() = user_id);

create index if not exists girlmate_created_idx on public.girlmate_profiles(created_at desc);
create index if not exists girlmate_city_idx    on public.girlmate_profiles(city, is_active);
create index if not exists girlmate_type_idx    on public.girlmate_profiles(listing_type, is_active);


-- ── hanger_listings ───────────────────────────────────────────────────────────

create table if not exists public.hanger_listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text,
  price_cents integer not null,
  size        text,
  category    text,
  condition   text default 'good',
  image_url   text,
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);

alter table public.hanger_listings enable row level security;

drop policy if exists "listings_read_active" on public.hanger_listings;
create policy "listings_read_active" on public.hanger_listings for select using (status = 'active' or auth.uid() = seller_id);

drop policy if exists "listings_write_own" on public.hanger_listings;
create policy "listings_write_own"   on public.hanger_listings for insert with check (auth.uid() = seller_id);

drop policy if exists "listings_update_own" on public.hanger_listings;
create policy "listings_update_own"  on public.hanger_listings for update using (auth.uid() = seller_id);

create index if not exists hanger_seller_idx   on public.hanger_listings(seller_id);
create index if not exists hanger_category_idx on public.hanger_listings(category, status);
create index if not exists hanger_created_idx  on public.hanger_listings(created_at desc);


-- ── hanger_sales ─────────────────────────────────────────────────────────────

create table if not exists public.hanger_sales (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.hanger_listings(id),
  seller_id    uuid not null references public.profiles(id),
  buyer_id     uuid not null references public.profiles(id),
  amount_cents  integer not null,
  fee_cents     integer not null,
  payout_cents  integer not null,
  paid_out     boolean default false,
  created_at   timestamptz not null default now()
);

alter table public.hanger_sales enable row level security;

drop policy if exists "sales_read_own" on public.hanger_sales;
create policy "sales_read_own"   on public.hanger_sales for select using (auth.uid() = seller_id or auth.uid() = buyer_id);

drop policy if exists "sales_insert_any" on public.hanger_sales;
create policy "sales_insert_any" on public.hanger_sales for insert with check (auth.uid() = buyer_id);


-- ── book_listings ─────────────────────────────────────────────────────────────

create table if not exists public.book_listings (
  id           uuid primary key default gen_random_uuid(),
  provider_id  uuid not null references public.profiles(id) on delete cascade,
  service_name text not null,
  category     text not null,
  description  text,
  price_cents  integer,
  price_type   text default 'fixed',
  location     text,
  image_url    text,
  is_active    boolean default true,
  created_at   timestamptz not null default now()
);

alter table public.book_listings enable row level security;

drop policy if exists "book_read_active" on public.book_listings;
create policy "book_read_active"  on public.book_listings for select using (is_active = true or auth.uid() = provider_id);

drop policy if exists "book_write_own" on public.book_listings;
create policy "book_write_own"    on public.book_listings for insert with check (auth.uid() = provider_id);

drop policy if exists "book_update_own" on public.book_listings;
create policy "book_update_own"   on public.book_listings for update using (auth.uid() = provider_id);

create index if not exists book_category_idx on public.book_listings(category, is_active);
create index if not exists book_provider_idx on public.book_listings(provider_id);


-- ── book_requests ─────────────────────────────────────────────────────────────

create table if not exists public.book_requests (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.book_listings(id) on delete cascade,
  client_id   uuid not null references public.profiles(id) on delete cascade,
  message     text,
  status      text default 'pending',
  created_at  timestamptz not null default now()
);

alter table public.book_requests enable row level security;

drop policy if exists "request_read_own" on public.book_requests;
create policy "request_read_own"  on public.book_requests for select using (auth.uid() = client_id or auth.uid() = (select provider_id from public.book_listings where id = listing_id));

drop policy if exists "request_write_own" on public.book_requests;
create policy "request_write_own" on public.book_requests for insert with check (auth.uid() = client_id);


-- ── bloom_trips ───────────────────────────────────────────────────────────────

create table if not exists public.bloom_trips (
  id                     uuid primary key default gen_random_uuid(),
  organizer_id           uuid not null references public.profiles(id) on delete cascade,
  title                  text not null,
  destination            text not null,
  description            text,
  departure_date         date not null,
  return_date            date,
  price_per_person_cents integer not null,
  capacity               integer not null,
  attending_count        integer not null default 0,
  includes               text[] default '{}',
  image_url              text,
  accent_color           text default '#FF1F7D',
  status                 text not null default 'open',
  created_at             timestamptz not null default now()
);

alter table public.bloom_trips enable row level security;

drop policy if exists "trips_read_open" on public.bloom_trips;
create policy "trips_read_open"  on public.bloom_trips for select using (status in ('open','full') or auth.uid() = organizer_id);

drop policy if exists "trips_write_own" on public.bloom_trips;
create policy "trips_write_own"  on public.bloom_trips for insert with check (auth.uid() = organizer_id);

drop policy if exists "trips_update_own" on public.bloom_trips;
create policy "trips_update_own" on public.bloom_trips for update using (auth.uid() = organizer_id);

create index if not exists trips_departure_idx on public.bloom_trips(departure_date asc);
create index if not exists trips_organizer_idx on public.bloom_trips(organizer_id);


-- ── bloom_trip_attendees ──────────────────────────────────────────────────────

create table if not exists public.bloom_trip_attendees (
  trip_id    uuid not null references public.bloom_trips(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (trip_id, user_id)
);

alter table public.bloom_trip_attendees enable row level security;

drop policy if exists "attendees_read_all" on public.bloom_trip_attendees;
create policy "attendees_read_all" on public.bloom_trip_attendees for select using (true);

drop policy if exists "attendees_join" on public.bloom_trip_attendees;
create policy "attendees_join"     on public.bloom_trip_attendees for insert with check (auth.uid() = user_id);

drop policy if exists "attendees_leave" on public.bloom_trip_attendees;
create policy "attendees_leave"    on public.bloom_trip_attendees for delete using (auth.uid() = user_id);


-- ── wellness_posts ────────────────────────────────────────────────────────────
-- The Health Bar: wellness posts (juice, smoothie, meal, tips, skincare).

create table if not exists public.wellness_posts (
  id          uuid        primary key default gen_random_uuid(),
  author_id   uuid        not null references public.profiles(id) on delete cascade,
  category    text        not null default 'juice'
              check (category in ('juice','smoothie','meal','tip','skincare')),
  title       text        not null,
  content     text,
  ingredients text[]      not null default '{}',
  steps       text[]      not null default '{}',
  image_url   text,
  saves_count integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.wellness_posts enable row level security;

drop policy if exists "wellness_posts_read_all" on public.wellness_posts;
create policy "wellness_posts_read_all"   on public.wellness_posts for select using (true);

drop policy if exists "wellness_posts_insert_own" on public.wellness_posts;
create policy "wellness_posts_insert_own" on public.wellness_posts for insert with check (auth.uid() = author_id);

drop policy if exists "wellness_posts_delete_own" on public.wellness_posts;
create policy "wellness_posts_delete_own" on public.wellness_posts for delete using (auth.uid() = author_id);

create index if not exists wellness_posts_author   on public.wellness_posts(author_id);
create index if not exists wellness_posts_category on public.wellness_posts(category);
create index if not exists wellness_posts_created  on public.wellness_posts(created_at desc);


-- ── wellness_saves ────────────────────────────────────────────────────────────

create table if not exists public.wellness_saves (
  id         uuid        primary key default gen_random_uuid(),
  post_id    uuid        not null references public.wellness_posts(id) on delete cascade,
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.wellness_saves enable row level security;

drop policy if exists "wellness_saves_read_own" on public.wellness_saves;
create policy "wellness_saves_read_own"   on public.wellness_saves for select using (auth.uid() = user_id);

drop policy if exists "wellness_saves_insert_own" on public.wellness_saves;
create policy "wellness_saves_insert_own" on public.wellness_saves for insert with check (auth.uid() = user_id);

drop policy if exists "wellness_saves_delete_own" on public.wellness_saves;
create policy "wellness_saves_delete_own" on public.wellness_saves for delete using (auth.uid() = user_id);

create index if not exists wellness_saves_user on public.wellness_saves(user_id);
create index if not exists wellness_saves_post on public.wellness_saves(post_id);


-- ── gathering_flowers ─────────────────────────────────────────────────────────
-- Give a flower to a gathering/happening. Depends on public.gatherings (pre-existing).

create table if not exists public.gathering_flowers (
  gathering_id  uuid not null references public.gatherings(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (gathering_id, user_id)
);

alter table public.gathering_flowers enable row level security;

drop policy if exists "gathering_flowers_read_all" on public.gathering_flowers;
create policy "gathering_flowers_read_all"
  on public.gathering_flowers for select using (true);

drop policy if exists "gathering_flowers_give_own" on public.gathering_flowers;
create policy "gathering_flowers_give_own"
  on public.gathering_flowers for insert with check (auth.uid() = user_id);

drop policy if exists "gathering_flowers_take_back_own" on public.gathering_flowers;
create policy "gathering_flowers_take_back_own"
  on public.gathering_flowers for delete using (auth.uid() = user_id);

create index if not exists gathering_flowers_gathering_idx on public.gathering_flowers(gathering_id);
create index if not exists gathering_flowers_user_idx     on public.gathering_flowers(user_id);


-- ── profile_flowers ───────────────────────────────────────────────────────────
-- Give a flower to a member's profile.

create table if not exists public.profile_flowers (
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  flower_type text not null default 'general' check (flower_type in ('general','witness','host','club')),
  message     text,
  created_at  timestamptz not null default now(),
  primary key (profile_id, user_id, flower_type)
);

alter table public.profile_flowers enable row level security;

drop policy if exists "profile_flowers_read_all" on public.profile_flowers;
create policy "profile_flowers_read_all"
  on public.profile_flowers for select using (true);

drop policy if exists "profile_flowers_give_own" on public.profile_flowers;
create policy "profile_flowers_give_own"
  on public.profile_flowers for insert with check (auth.uid() = user_id);

drop policy if exists "profile_flowers_take_back_own" on public.profile_flowers;
create policy "profile_flowers_take_back_own"
  on public.profile_flowers for delete using (auth.uid() = user_id);

create index if not exists profile_flowers_profile_idx on public.profile_flowers(profile_id, created_at desc);
create index if not exists profile_flowers_user_idx    on public.profile_flowers(user_id, created_at desc);


-- ── traditions ────────────────────────────────────────────────────────────────
-- Recurring event series. Depends on public.clubs (pre-existing).

create table if not exists public.traditions (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references public.profiles(id) on delete cascade,
  name           text not null,
  slug           text not null unique,
  description    text,
  frequency      text not null default 'monthly'
    check (frequency in ('weekly','biweekly','monthly','seasonal','irregular')),
  neighborhood   text,
  cover_url      text,
  primary_color  text default '#FF1F7D',
  status         text not null default 'active'
    check (status in ('active','paused','became_club')),
  club_id        uuid references public.clubs(id) on delete set null,
  gathering_count int not null default 0,
  follower_count  int not null default 0,
  created_at     timestamptz not null default now()
);

alter table public.traditions enable row level security;

drop policy if exists "traditions_read_all" on public.traditions;
create policy "traditions_read_all"
  on public.traditions for select using (true);

drop policy if exists "traditions_insert_own" on public.traditions;
create policy "traditions_insert_own"
  on public.traditions for insert with check (auth.uid() = host_id);

drop policy if exists "traditions_update_own" on public.traditions;
create policy "traditions_update_own"
  on public.traditions for update using (auth.uid() = host_id);

create index if not exists traditions_host_idx  on public.traditions(host_id);
create index if not exists traditions_slug_idx  on public.traditions(slug);


-- ── tradition_followers ───────────────────────────────────────────────────────

create table if not exists public.tradition_followers (
  tradition_id  uuid not null references public.traditions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (tradition_id, user_id)
);

alter table public.tradition_followers enable row level security;

drop policy if exists "tradition_followers_read_all" on public.tradition_followers;
create policy "tradition_followers_read_all"
  on public.tradition_followers for select using (true);

drop policy if exists "tradition_followers_insert_own" on public.tradition_followers;
create policy "tradition_followers_insert_own"
  on public.tradition_followers for insert with check (auth.uid() = user_id);

drop policy if exists "tradition_followers_delete_own" on public.tradition_followers;
create policy "tradition_followers_delete_own"
  on public.tradition_followers for delete using (auth.uid() = user_id);

create index if not exists tradition_followers_user on public.tradition_followers(user_id);


-- ── bloomies_plans ────────────────────────────────────────────────────────────
-- Bloomies Planner: group plans with RSVP and built-in group chat.

CREATE TABLE IF NOT EXISTS public.bloomies_plans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  plan_type   text NOT NULL DEFAULT 'hangout'
              CHECK (plan_type IN ('dinner','birthday','hangout','trip','brunch','other')),
  description text,
  date_time   timestamptz,
  venue       text,
  status      text NOT NULL DEFAULT 'active'
              CHECK (status IN ('active','cancelled','completed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bloomies_plans ENABLE ROW LEVEL SECURITY;

-- plan_select is deferred below (after bloomies_plan_invites is created)

DROP POLICY IF EXISTS "plan_insert" ON public.bloomies_plans;
CREATE POLICY "plan_insert" ON public.bloomies_plans FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "plan_update" ON public.bloomies_plans;
CREATE POLICY "plan_update" ON public.bloomies_plans FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "plan_delete" ON public.bloomies_plans;
CREATE POLICY "plan_delete" ON public.bloomies_plans FOR DELETE USING (auth.uid() = creator_id);

CREATE INDEX IF NOT EXISTS idx_bloomies_plans_creator ON public.bloomies_plans(creator_id, created_at DESC);


-- ── bloomies_plan_invites ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bloomies_plan_invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES public.bloomies_plans(id) ON DELETE CASCADE,
  invitee_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rsvp_status text NOT NULL DEFAULT 'pending'
              CHECK (rsvp_status IN ('pending','yes','maybe','no')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, invitee_id)
);

ALTER TABLE public.bloomies_plan_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invite_select" ON public.bloomies_plan_invites;
CREATE POLICY "invite_select" ON public.bloomies_plan_invites FOR SELECT
  USING (
    invitee_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
  );

DROP POLICY IF EXISTS "invite_insert" ON public.bloomies_plan_invites;
CREATE POLICY "invite_insert" ON public.bloomies_plan_invites FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.bloomies_plans WHERE id = plan_id AND creator_id = auth.uid()));

DROP POLICY IF EXISTS "invite_update_rsvp" ON public.bloomies_plan_invites;
CREATE POLICY "invite_update_rsvp" ON public.bloomies_plan_invites FOR UPDATE
  USING (invitee_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_bloomies_invites_plan    ON public.bloomies_plan_invites(plan_id);
CREATE INDEX IF NOT EXISTS idx_bloomies_invites_invitee ON public.bloomies_plan_invites(invitee_id, created_at DESC);

-- Deferred: plan_select cross-references bloomies_plan_invites so must come after it
DROP POLICY IF EXISTS "plan_select" ON public.bloomies_plans;
CREATE POLICY "plan_select" ON public.bloomies_plans FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM public.bloomies_plan_invites WHERE plan_id = id AND invitee_id = auth.uid())
  );


-- ── bloomies_plan_messages ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bloomies_plan_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    uuid NOT NULL REFERENCES public.bloomies_plans(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (char_length(content) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bloomies_plan_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "msg_select" ON public.bloomies_plan_messages;
CREATE POLICY "msg_select" ON public.bloomies_plan_messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.bloomies_plan_invites WHERE plan_id = public.bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
  );

DROP POLICY IF EXISTS "msg_insert" ON public.bloomies_plan_messages;
CREATE POLICY "msg_insert" ON public.bloomies_plan_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (SELECT 1 FROM public.bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
      OR EXISTS (SELECT 1 FROM public.bloomies_plan_invites WHERE plan_id = public.bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
    )
  );

CREATE INDEX IF NOT EXISTS idx_bloomies_messages_plan ON public.bloomies_plan_messages(plan_id, created_at);


-- ── bloom_bouquet ─────────────────────────────────────────────────────────────
-- A woman's inner circle (up to 12). Pinged in Bloom Safe Mode.

create table if not exists public.bloom_bouquet (
  id        uuid primary key default gen_random_uuid(),
  owner_id  uuid not null references public.profiles(id) on delete cascade,
  member_id uuid not null references public.profiles(id) on delete cascade,
  position  smallint not null default 0,
  added_at  timestamptz not null default now(),
  unique (owner_id, member_id),
  check (position between 0 and 11)
);

alter table public.bloom_bouquet enable row level security;

drop policy if exists "bouquet_read_own" on public.bloom_bouquet;
create policy "bouquet_read_own"
  on public.bloom_bouquet for select
  using (auth.uid() = owner_id);

drop policy if exists "bouquet_add" on public.bloom_bouquet;
create policy "bouquet_add"
  on public.bloom_bouquet for insert
  with check (auth.uid() = owner_id);

drop policy if exists "bouquet_remove" on public.bloom_bouquet;
create policy "bouquet_remove"
  on public.bloom_bouquet for delete
  using (auth.uid() = owner_id);

drop policy if exists "bouquet_reorder" on public.bloom_bouquet;
create policy "bouquet_reorder"
  on public.bloom_bouquet for update
  using (auth.uid() = owner_id);

create index if not exists bouquet_owner_idx on public.bloom_bouquet(owner_id, position);


-- ── safety_pings ──────────────────────────────────────────────────────────────
-- Silent signals to bouquet members.

create table if not exists public.safety_pings (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'sent'
    check (status in ('sent','seen','responded')),
  event_name   text,
  created_at   timestamptz not null default now()
);

alter table public.safety_pings enable row level security;

drop policy if exists "pings_read_own" on public.safety_pings;
create policy "pings_read_own"
  on public.safety_pings for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "pings_send" on public.safety_pings;
create policy "pings_send"
  on public.safety_pings for insert
  with check (auth.uid() = sender_id);

drop policy if exists "pings_update_recipient" on public.safety_pings;
create policy "pings_update_recipient"
  on public.safety_pings for update
  using (auth.uid() = recipient_id);

create index if not exists pings_recipient_idx on public.safety_pings(recipient_id, created_at desc);
create index if not exists pings_sender_idx    on public.safety_pings(sender_id,    created_at desc);


-- ── event_checkins ────────────────────────────────────────────────────────────
-- QR code scan at venue check-in. Depends on public.gatherings (pre-existing).

create table if not exists public.event_checkins (
  id            uuid primary key default gen_random_uuid(),
  event_id      uuid not null references public.gatherings(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  method        text not null default 'qr'
    check (method in ('qr','manual','host')),
  unique (event_id, user_id)
);

alter table public.event_checkins enable row level security;

drop policy if exists "checkins_read_event" on public.event_checkins;
create policy "checkins_read_event"
  on public.event_checkins for select
  using (true);

drop policy if exists "checkins_own" on public.event_checkins;
create policy "checkins_own"
  on public.event_checkins for insert
  with check (auth.uid() = user_id);

drop policy if exists "checkins_delete_own" on public.event_checkins;
create policy "checkins_delete_own"
  on public.event_checkins for delete
  using (auth.uid() = user_id);

create index if not exists checkins_event_idx on public.event_checkins(event_id);
create index if not exists checkins_user_idx  on public.event_checkins(user_id, checked_in_at desc);


-- ── friend_scans ──────────────────────────────────────────────────────────────
-- "I just met her" at an event. Depends on public.gatherings (pre-existing).

create table if not exists public.friend_scans (
  id           uuid primary key default gen_random_uuid(),
  initiator_id uuid not null references public.profiles(id) on delete cascade,
  scanned_id   uuid not null references public.profiles(id) on delete cascade,
  event_id     uuid references public.gatherings(id) on delete set null,
  scanned_at   timestamptz not null default now(),
  unique (initiator_id, scanned_id, event_id)
);

alter table public.friend_scans enable row level security;

drop policy if exists "scans_read_own" on public.friend_scans;
create policy "scans_read_own"
  on public.friend_scans for select
  using (auth.uid() = initiator_id or auth.uid() = scanned_id);

drop policy if exists "scans_write_own" on public.friend_scans;
create policy "scans_write_own"
  on public.friend_scans for insert
  with check (auth.uid() = initiator_id);

create index if not exists scans_initiator_idx on public.friend_scans(initiator_id, scanned_at desc);
create index if not exists scans_scanned_idx   on public.friend_scans(scanned_id,   scanned_at desc);


-- ── city_trending ─────────────────────────────────────────────────────────────
-- Live "what's hot" feed for the City section.

create table if not exists public.city_trending (
  id           uuid primary key default gen_random_uuid(),
  city         text not null default 'New York',
  neighborhood text,
  name         text not null,
  category     text not null
    check (category in ('dining','drinks','pop-up','art','nightlife','brunch','coffee','shopping','wellness','event','other')),
  description  text,
  source       text,
  source_url   text,
  image_url    text,
  badge        text,
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,
  week_of      date not null default current_date,
  rank_order   smallint default 99,
  save_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.city_trending enable row level security;

drop policy if exists "trending_read_approved" on public.city_trending;
create policy "trending_read_approved"
  on public.city_trending for select
  using (status = 'approved');

drop policy if exists "trending_submit" on public.city_trending;
create policy "trending_submit"
  on public.city_trending for insert
  with check (
    auth.uid() = submitted_by and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('curator','admin','founder')
    )
  );

drop policy if exists "trending_manage" on public.city_trending;
create policy "trending_manage"
  on public.city_trending for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder')
    )
  );

create index if not exists trending_city_week_idx on public.city_trending(city, week_of desc, status, rank_order);


-- ── city_trending_saves ───────────────────────────────────────────────────────

create table if not exists public.city_trending_saves (
  trending_id uuid not null references public.city_trending(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  saved_at    timestamptz not null default now(),
  primary key (trending_id, user_id)
);

alter table public.city_trending_saves enable row level security;

drop policy if exists "trending_saves_read_own" on public.city_trending_saves;
create policy "trending_saves_read_own"
  on public.city_trending_saves for select
  using (auth.uid() = user_id);

drop policy if exists "trending_saves_add" on public.city_trending_saves;
create policy "trending_saves_add"
  on public.city_trending_saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "trending_saves_remove" on public.city_trending_saves;
create policy "trending_saves_remove"
  on public.city_trending_saves for delete
  using (auth.uid() = user_id);


-- ── avenue_content ────────────────────────────────────────────────────────────
-- Weekly content curated by each Avenue room's AI editor.

create table if not exists public.avenue_content (
  id           uuid primary key default gen_random_uuid(),
  room         text not null
    check (room in ('magazine','book','screening','wellness','hanger','vanity','wall','shop','city')),
  content_type text not null,
  title        text not null,
  body         text,
  image_url    text,
  source       text,
  source_url   text,
  meta         jsonb default '{}',
  yande_note   text,
  badge        text,
  week_of      date not null default current_date,
  rank_order   smallint default 99,
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,
  save_count   integer not null default 0,
  like_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

alter table public.avenue_content enable row level security;

drop policy if exists "avenue_content_read_approved" on public.avenue_content;
create policy "avenue_content_read_approved"
  on public.avenue_content for select
  using (status = 'approved');

drop policy if exists "avenue_content_submit" on public.avenue_content;
create policy "avenue_content_submit"
  on public.avenue_content for insert
  with check (
    auth.uid() is not null and
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('curator','admin','founder')
    )
  );

drop policy if exists "avenue_content_manage" on public.avenue_content;
create policy "avenue_content_manage"
  on public.avenue_content for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder')
    )
  );

create index if not exists avenue_content_room_week_idx on public.avenue_content(room, week_of desc, status, rank_order);
create index if not exists avenue_content_status_idx    on public.avenue_content(status, room, week_of desc);


-- ── avenue_content_saves ──────────────────────────────────────────────────────

create table if not exists public.avenue_content_saves (
  content_id uuid not null references public.avenue_content(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  saved_at   timestamptz not null default now(),
  primary key (content_id, user_id)
);

alter table public.avenue_content_saves enable row level security;

drop policy if exists "avenue_saves_own" on public.avenue_content_saves;
create policy "avenue_saves_own"
  on public.avenue_content_saves for select using (auth.uid() = user_id);

drop policy if exists "avenue_saves_add" on public.avenue_content_saves;
create policy "avenue_saves_add"
  on public.avenue_content_saves for insert with check (auth.uid() = user_id);

drop policy if exists "avenue_saves_remove" on public.avenue_content_saves;
create policy "avenue_saves_remove"
  on public.avenue_content_saves for delete using (auth.uid() = user_id);


-- ── editor_instructions ───────────────────────────────────────────────────────
-- Founder's taste profile for each AI editor.

create table if not exists public.editor_instructions (
  id               uuid        primary key default gen_random_uuid(),
  editor_name      text        not null,
  instruction_type text        not null check (instruction_type in ('voice', 'reference', 'correction', 'feedback')),
  instruction      text        not null,
  reference_title  text,
  original_content text,
  edited_content   text,
  active           boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.editor_instructions enable row level security;

drop policy if exists "editor_instructions_service_only" on public.editor_instructions;
create policy "editor_instructions_service_only"
  on public.editor_instructions
  using (false);

create index if not exists idx_editor_instructions_editor on public.editor_instructions(editor_name, active);


-- ── founder_analyst_reports ───────────────────────────────────────────────────
-- Weekly Yande digest reports.

create table if not exists public.founder_analyst_reports (
  id          uuid        primary key default gen_random_uuid(),
  week_of     date        not null unique,
  report_text text        not null,
  raw_data    jsonb,
  created_at  timestamptz not null default now()
);

alter table public.founder_analyst_reports enable row level security;

drop policy if exists "analyst_reports_service_only" on public.founder_analyst_reports;
create policy "analyst_reports_service_only"
  on public.founder_analyst_reports using (false);


-- ── girlmate_partner_applications ─────────────────────────────────────────────

create table if not exists public.girlmate_partner_applications (
  id           uuid        primary key default gen_random_uuid(),
  contact_name text        not null,
  email        text        not null,
  group_name   text        not null,
  platform     text        not null default 'other',
  group_size   text,
  cities       text,
  description  text,
  why_partner  text,
  status       text        not null default 'pending'
               check (status in ('pending', 'approved', 'declined')),
  partner_code text        unique,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  reviewed_by  text
);

alter table public.girlmate_partner_applications enable row level security;

drop policy if exists "gm_partner_apps_service_only" on public.girlmate_partner_applications;
create policy "gm_partner_apps_service_only"
  on public.girlmate_partner_applications using (false);


-- ── friendship_scores ─────────────────────────────────────────────────────────
-- Tracks co-attendance and friend scan counts per pair of women.

create table if not exists public.friendship_scores (
  user_a              uuid        not null references public.profiles(id) on delete cascade,
  user_b              uuid        not null references public.profiles(id) on delete cascade,
  co_attendance_count integer     not null default 0,
  friend_scan_count   integer     not null default 0,
  score               integer     not null default 0,
  last_seen_together  timestamptz,
  updated_at          timestamptz not null default now(),
  primary key (user_a, user_b),
  check (user_a < user_b)
);

alter table public.friendship_scores enable row level security;

drop policy if exists "friendship_scores_own" on public.friendship_scores;
create policy "friendship_scores_own"
  on public.friendship_scores for select
  using (auth.uid() = user_a or auth.uid() = user_b);

create index if not exists friendship_scores_a_idx on public.friendship_scores(user_a, score desc);
create index if not exists friendship_scores_b_idx on public.friendship_scores(user_b, score desc);


-- ── girlmate_messages ─────────────────────────────────────────────────────────
-- GirlMate direct messages. Depends on girlmate_profiles (created above).

create table if not exists public.girlmate_messages (
  id           uuid        primary key default gen_random_uuid(),
  from_user_id uuid        not null references public.profiles(id) on delete cascade,
  to_user_id   uuid        not null references public.profiles(id) on delete cascade,
  listing_id   uuid        references public.girlmate_profiles(id) on delete set null,
  body         text        not null,
  read         boolean     not null default false,
  created_at   timestamptz not null default now()
);

alter table public.girlmate_messages enable row level security;

drop policy if exists "gm_messages_read" on public.girlmate_messages;
create policy "gm_messages_read" on public.girlmate_messages
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

drop policy if exists "gm_messages_send" on public.girlmate_messages;
create policy "gm_messages_send" on public.girlmate_messages
  for insert with check (auth.uid() = from_user_id);

drop policy if exists "gm_messages_mark_read" on public.girlmate_messages;
create policy "gm_messages_mark_read" on public.girlmate_messages
  for update using (auth.uid() = to_user_id)
  with check (auth.uid() = to_user_id);


-- ── user_feedback ─────────────────────────────────────────────────────────────

create table if not exists public.user_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  page_url    text,
  category    text not null default 'bug',
  priority    text not null default 'normal',
  message     text not null,
  device_info text,
  status      text not null default 'open',
  assigned_to text,
  admin_notes text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.user_feedback enable row level security;

drop policy if exists "users_insert_feedback" on public.user_feedback;
create policy "users_insert_feedback" on public.user_feedback
  for insert with check (auth.uid() = user_id or user_id is null);

drop policy if exists "admin_manage_feedback" on public.user_feedback;
create policy "admin_manage_feedback" on public.user_feedback
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

create index if not exists idx_feedback_status on public.user_feedback(status, created_at desc);


-- ── site_health_reports ───────────────────────────────────────────────────────

create table if not exists public.site_health_reports (
  id              uuid primary key default gen_random_uuid(),
  agent_name      text not null,
  area            text not null,
  status          text not null,
  summary         text not null,
  details         jsonb,
  action_taken    text,
  needs_approval  boolean not null default false,
  approval_status text,
  created_at      timestamptz not null default now()
);

alter table public.site_health_reports enable row level security;

drop policy if exists "admin_manage_health_reports" on public.site_health_reports;
create policy "admin_manage_health_reports" on public.site_health_reports
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

create index if not exists idx_health_created on public.site_health_reports(created_at desc);


-- ── pin_drops ─────────────────────────────────────────────────────────────────

create table if not exists public.pin_drops (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade not null,
  location   text not null,
  caption    text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.pin_drops enable row level security;

drop policy if exists "members_read_pins" on public.pin_drops;
create policy "members_read_pins" on public.pin_drops
  for select using (expires_at > now());

drop policy if exists "members_insert_pins" on public.pin_drops;
create policy "members_insert_pins" on public.pin_drops
  for insert with check (auth.uid() = user_id);


-- ── pin_drop_joins ────────────────────────────────────────────────────────────

create table if not exists public.pin_drop_joins (
  id        uuid primary key default gen_random_uuid(),
  pin_id    uuid references public.pin_drops(id) on delete cascade not null,
  user_id   uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz not null default now(),
  unique(pin_id, user_id)
);

alter table public.pin_drop_joins enable row level security;

drop policy if exists "members_join_pins" on public.pin_drop_joins;
create policy "members_join_pins" on public.pin_drop_joins
  for insert with check (auth.uid() = user_id);

drop policy if exists "members_read_joins" on public.pin_drop_joins;
create policy "members_read_joins" on public.pin_drop_joins
  for select using (true);


-- ── table_reservations ────────────────────────────────────────────────────────

create table if not exists public.table_reservations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete set null,
  restaurant_id   text not null,
  restaurant_name text not null,
  date            date not null,
  time            text not null,
  party_size      integer not null default 2,
  notes           text,
  status          text not null default 'pending',
  confirmed_at    timestamptz,
  cancelled_at    timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.table_reservations enable row level security;

drop policy if exists "users_read_own_reservations" on public.table_reservations;
create policy "users_read_own_reservations" on public.table_reservations
  for select using (auth.uid() = user_id);

drop policy if exists "users_insert_reservations" on public.table_reservations;
create policy "users_insert_reservations" on public.table_reservations
  for insert with check (auth.uid() = user_id);

drop policy if exists "service_manages_reservations" on public.table_reservations;
create policy "service_manages_reservations" on public.table_reservations
  for all using (true) with check (true);

create index if not exists table_reservations_user_id_idx       on public.table_reservations(user_id);
create index if not exists table_reservations_restaurant_id_idx on public.table_reservations(restaurant_id);
create index if not exists table_reservations_date_idx          on public.table_reservations(date);


-- ─────────────────────────────────────────────────────────────────────────────
-- VIEWS (at the end, after all tables exist)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── hanger_seller_balance ─────────────────────────────────────────────────────
-- Summarises pending vs paid-out earnings per seller.

create or replace view public.hanger_seller_balance as
  select
    seller_id,
    coalesce(sum(payout_cents) filter (where not paid_out), 0) as pending_cents,
    coalesce(sum(payout_cents) filter (where paid_out), 0)     as paid_out_cents
  from public.hanger_sales
  group by seller_id;


-- ── hanger_earnings ───────────────────────────────────────────────────────────
-- Shows the seller side of every completed hanger purchase.
-- JOIN uses hl.id::text = p.item_id to match uuid→text item_id in purchases.

create or replace view public.hanger_earnings as
  select
    p.id,
    p.user_id                              as buyer_id,
    hl.seller_id,
    p.item_name,
    p.item_id                              as listing_id,
    p.amount_cents,
    round(p.amount_cents * 0.90)::integer  as seller_receives_cents,
    round(p.amount_cents * 0.10)::integer  as bloombay_fee_cents,
    p.created_at
  from public.purchases p
  join public.hanger_listings hl on hl.id::text = p.item_id
  where p.type = 'hanger_purchase'
    and p.status = 'completed';
