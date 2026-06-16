-- Bloom notes: little notes women leave behind at places — separate from reviews.
-- Other women can give the author flowers (likes) and save the note.

create table if not exists public.bloom_notes (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  place_slug  text not null,            -- restaurant partner slug or city place id
  place_name  text,                     -- denormalized for display ("Carbone")
  content     text not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.bloom_note_flowers (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

create table if not exists public.bloom_note_saves (
  note_id     uuid not null references public.bloom_notes(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (note_id, user_id)
);

-- RLS
alter table public.bloom_notes        enable row level security;
alter table public.bloom_note_flowers enable row level security;
alter table public.bloom_note_saves   enable row level security;

drop policy if exists "notes_read_all" on public.bloom_notes;
create policy "notes_read_all"
  on public.bloom_notes for select using (true);

drop policy if exists "notes_insert_own" on public.bloom_notes;
create policy "notes_insert_own"
  on public.bloom_notes for insert with check (auth.uid() = author_id);

drop policy if exists "notes_delete_own" on public.bloom_notes;
create policy "notes_delete_own"
  on public.bloom_notes for delete using (auth.uid() = author_id);

drop policy if exists "flowers_read_all" on public.bloom_note_flowers;
create policy "flowers_read_all"
  on public.bloom_note_flowers for select using (true);

drop policy if exists "flowers_give_own" on public.bloom_note_flowers;
create policy "flowers_give_own"
  on public.bloom_note_flowers for insert with check (auth.uid() = user_id);

drop policy if exists "flowers_take_back_own" on public.bloom_note_flowers;
create policy "flowers_take_back_own"
  on public.bloom_note_flowers for delete using (auth.uid() = user_id);

drop policy if exists "saves_read_own" on public.bloom_note_saves;
create policy "saves_read_own"
  on public.bloom_note_saves for select using (auth.uid() = user_id);

drop policy if exists "saves_insert_own" on public.bloom_note_saves;
create policy "saves_insert_own"
  on public.bloom_note_saves for insert with check (auth.uid() = user_id);

drop policy if exists "saves_delete_own" on public.bloom_note_saves;
create policy "saves_delete_own"
  on public.bloom_note_saves for delete using (auth.uid() = user_id);

-- When a woman gives a flower, the note's author hears about it
create or replace function public.notify_bloom_note_flower()
returns trigger language plpgsql security definer as $$
declare
  v_author uuid;
  v_place  text;
begin
  select author_id, coalesce(place_name, place_slug)
    into v_author, v_place
    from public.bloom_notes where id = new.note_id;

  if v_author is not null and v_author <> new.user_id then
    perform public.create_notification(
      v_author,
      'flower',
      'Someone gave your bloom note a flower',
      'Your note at ' || v_place || ' meant something to her.',
      '/member/city',
      jsonb_build_object('note_id', new.note_id, 'place_slug', (select place_slug from public.bloom_notes where id = new.note_id))
    );
  end if;
  return new;
end;
$$;

DO $$ BEGIN drop trigger if exists bloom_note_flower_notify on public.bloom_note_flowers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger bloom_note_flower_notify
  after insert on public.bloom_note_flowers
  for each row execute function public.notify_bloom_note_flower();

-- Indexes
create index if not exists bloom_notes_place_idx  on public.bloom_notes(place_slug, created_at desc);
create index if not exists bloom_notes_author_idx on public.bloom_notes(author_id, created_at desc);
create index if not exists note_saves_user_idx    on public.bloom_note_saves(user_id, created_at desc);
-- Event extras: waitlist, post-event witnesses, host reviews

-- Waitlist: women who want in when an event is full
create table if not exists public.event_waitlist (
  id         uuid primary key default gen_random_uuid(),
  event_id   text not null,   -- uuid stored as text: compatible with both gatherings + events
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Post-event witnesses: after an event, tag who you met
create table if not exists public.event_witnesses (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null,
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id   uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (event_id, from_user_id, to_user_id),
  check (from_user_id <> to_user_id)
);

-- Host reviews: women rate a host after attending
create table if not exists public.host_reviews (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null,
  host_id     uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  content     text,
  created_at  timestamptz not null default now(),
  unique (event_id, reviewer_id)
);

-- RLS
alter table public.event_waitlist  enable row level security;
alter table public.event_witnesses enable row level security;
alter table public.host_reviews    enable row level security;

drop policy if exists "waitlist_read_all" on public.event_waitlist;
create policy "waitlist_read_all"   on public.event_waitlist  for select using (true);
drop policy if exists "waitlist_join" on public.event_waitlist;
create policy "waitlist_join"       on public.event_waitlist  for insert with check (auth.uid() = user_id);
drop policy if exists "waitlist_leave" on public.event_waitlist;
create policy "waitlist_leave"      on public.event_waitlist  for delete using  (auth.uid() = user_id);

drop policy if exists "witnesses_read_all" on public.event_witnesses;
create policy "witnesses_read_all"  on public.event_witnesses for select using (true);
drop policy if exists "witnesses_write_own" on public.event_witnesses;
create policy "witnesses_write_own" on public.event_witnesses for insert with check (auth.uid() = from_user_id);
drop policy if exists "witnesses_delete_own" on public.event_witnesses;
create policy "witnesses_delete_own" on public.event_witnesses for delete using (auth.uid() = from_user_id);

drop policy if exists "reviews_read_all" on public.host_reviews;
create policy "reviews_read_all"   on public.host_reviews for select using (true);
drop policy if exists "reviews_write_own" on public.host_reviews;
create policy "reviews_write_own"  on public.host_reviews for insert with check (auth.uid() = reviewer_id);
drop policy if exists "reviews_delete_own" on public.host_reviews;
create policy "reviews_delete_own" on public.host_reviews for delete using  (auth.uid() = reviewer_id);

-- Notify host when they receive a review
create or replace function public.notify_host_review()
returns trigger language plpgsql security definer as $$
begin
  if new.host_id <> new.reviewer_id then
    perform public.create_notification(
      new.host_id,
      'host_review',
      'Someone reviewed you as a host',
      'A woman rated her experience at your event.',
      '/member/profile',
      jsonb_build_object('event_id', new.event_id, 'rating', new.rating)
    );
  end if;
  return new;
end;
$$;

DO $$ BEGIN drop trigger if exists host_review_notify on public.host_reviews; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger host_review_notify
  after insert on public.host_reviews
  for each row execute function public.notify_host_review();

-- Notify user when someone witnesses them
create or replace function public.notify_witness()
returns trigger language plpgsql security definer as $$
begin
  perform public.create_notification(
    new.to_user_id,
    'witness',
    'Someone witnessed you',
    'A woman tagged you at a recent event.',
    '/member/happenings',
    jsonb_build_object('event_id', new.event_id, 'from_user_id', new.from_user_id)
  );
  return new;
end;
$$;

DO $$ BEGIN drop trigger if exists witness_notify on public.event_witnesses; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger witness_notify
  after insert on public.event_witnesses
  for each row execute function public.notify_witness();

-- Indexes
create index if not exists waitlist_event_idx    on public.event_waitlist(event_id, created_at);
create index if not exists waitlist_user_idx     on public.event_waitlist(user_id);
create index if not exists witnesses_event_idx   on public.event_witnesses(event_id);
create index if not exists witnesses_to_user_idx on public.event_witnesses(to_user_id);
create index if not exists reviews_host_idx      on public.host_reviews(host_id, created_at desc);
create index if not exists reviews_event_idx     on public.host_reviews(event_id);
create table if not exists public.girlmate_profiles (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  neighborhoods text[] not null default '{}',
  budget_min   integer,
  budget_max   integer,
  move_in_date date,
  bio          text,
  lifestyle_tags text[] default '{}',
  pets         boolean default false,
  smoking      boolean default false,
  is_active    boolean default true,
  created_at   timestamptz not null default now(),
  unique (user_id)
);

alter table public.girlmate_profiles enable row level security;
drop policy if exists "girlmate_read_active" on public.girlmate_profiles;
create policy "girlmate_read_active" on public.girlmate_profiles for select using (is_active = true);
drop policy if exists "girlmate_write_own" on public.girlmate_profiles;
create policy "girlmate_write_own"   on public.girlmate_profiles for insert with check (auth.uid() = user_id);
drop policy if exists "girlmate_update_own" on public.girlmate_profiles;
create policy "girlmate_update_own"  on public.girlmate_profiles for update using  (auth.uid() = user_id);
drop policy if exists "girlmate_delete_own" on public.girlmate_profiles;
create policy "girlmate_delete_own"  on public.girlmate_profiles for delete using  (auth.uid() = user_id);

create index if not exists girlmate_created_idx on public.girlmate_profiles(created_at desc);
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

create table if not exists public.hanger_sales (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.hanger_listings(id),
  seller_id   uuid not null references public.profiles(id),
  buyer_id    uuid not null references public.profiles(id),
  amount_cents integer not null,
  fee_cents    integer not null,
  payout_cents integer not null,
  paid_out    boolean default false,
  created_at  timestamptz not null default now()
);

-- Seller balance view
create or replace view public.hanger_seller_balance as
  select seller_id, coalesce(sum(payout_cents) filter (where not paid_out), 0) as pending_cents,
         coalesce(sum(payout_cents) filter (where paid_out), 0) as paid_out_cents
  from public.hanger_sales
  group by seller_id;

alter table public.hanger_listings enable row level security;
alter table public.hanger_sales    enable row level security;

drop policy if exists "listings_read_active" on public.hanger_listings;
create policy "listings_read_active" on public.hanger_listings for select using (status = 'active' or auth.uid() = seller_id);
drop policy if exists "listings_write_own" on public.hanger_listings;
create policy "listings_write_own"   on public.hanger_listings for insert with check (auth.uid() = seller_id);
drop policy if exists "listings_update_own" on public.hanger_listings;
create policy "listings_update_own"  on public.hanger_listings for update using  (auth.uid() = seller_id);
drop policy if exists "sales_read_own" on public.hanger_sales;
create policy "sales_read_own"       on public.hanger_sales    for select using  (auth.uid() = seller_id or auth.uid() = buyer_id);
drop policy if exists "sales_insert_any" on public.hanger_sales;
create policy "sales_insert_any"     on public.hanger_sales    for insert with check (auth.uid() = buyer_id);

create index if not exists hanger_seller_idx   on public.hanger_listings(seller_id);
create index if not exists hanger_category_idx on public.hanger_listings(category, status);
create index if not exists hanger_created_idx  on public.hanger_listings(created_at desc);
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

create table if not exists public.book_requests (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.book_listings(id) on delete cascade,
  client_id   uuid not null references public.profiles(id) on delete cascade,
  message     text,
  status      text default 'pending',
  created_at  timestamptz not null default now()
);

alter table public.book_listings  enable row level security;
alter table public.book_requests  enable row level security;

drop policy if exists "book_read_active" on public.book_listings;
create policy "book_read_active"  on public.book_listings  for select using (is_active = true or auth.uid() = provider_id);
drop policy if exists "book_write_own" on public.book_listings;
create policy "book_write_own"    on public.book_listings  for insert with check (auth.uid() = provider_id);
drop policy if exists "book_update_own" on public.book_listings;
create policy "book_update_own"   on public.book_listings  for update using  (auth.uid() = provider_id);
drop policy if exists "request_read_own" on public.book_requests;
create policy "request_read_own"  on public.book_requests  for select using  (auth.uid() = client_id or auth.uid() = (select provider_id from public.book_listings where id = listing_id));
drop policy if exists "request_write_own" on public.book_requests;
create policy "request_write_own" on public.book_requests  for insert with check (auth.uid() = client_id);

create index if not exists book_category_idx  on public.book_listings(category, is_active);
create index if not exists book_provider_idx  on public.book_listings(provider_id);
create table if not exists public.bloom_trips (
  id                    uuid primary key default gen_random_uuid(),
  organizer_id          uuid not null references public.profiles(id) on delete cascade,
  title                 text not null,
  destination           text not null,
  description           text,
  departure_date        date not null,
  return_date           date,
  price_per_person_cents integer not null,
  capacity              integer not null,
  attending_count       integer not null default 0,
  includes              text[] default '{}',
  image_url             text,
  accent_color          text default '#FF1F7D',
  status                text not null default 'open',
  created_at            timestamptz not null default now()
);

create table if not exists public.bloom_trip_attendees (
  trip_id    uuid not null references public.bloom_trips(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  joined_at  timestamptz not null default now(),
  primary key (trip_id, user_id)
);

create or replace function public.sync_trip_count() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.bloom_trips set attending_count = attending_count + 1 where id = new.trip_id;
  elsif tg_op = 'DELETE' then
    update public.bloom_trips set attending_count = greatest(0, attending_count - 1) where id = old.trip_id;
  end if;
  return null;
end;
$$;

DO $$ BEGIN drop trigger if exists bloom_trip_count_sync on public.bloom_trip_attendees; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger bloom_trip_count_sync
  after insert or delete on public.bloom_trip_attendees
  for each row execute function public.sync_trip_count();

alter table public.bloom_trips          enable row level security;
alter table public.bloom_trip_attendees enable row level security;

drop policy if exists "trips_read_open" on public.bloom_trips;
create policy "trips_read_open"       on public.bloom_trips          for select using (status in ('open','full') or auth.uid() = organizer_id);
drop policy if exists "trips_write_own" on public.bloom_trips;
create policy "trips_write_own"       on public.bloom_trips          for insert with check (auth.uid() = organizer_id);
drop policy if exists "trips_update_own" on public.bloom_trips;
create policy "trips_update_own"      on public.bloom_trips          for update using  (auth.uid() = organizer_id);
drop policy if exists "attendees_read_all" on public.bloom_trip_attendees;
create policy "attendees_read_all"    on public.bloom_trip_attendees for select using (true);
drop policy if exists "attendees_join" on public.bloom_trip_attendees;
create policy "attendees_join"        on public.bloom_trip_attendees for insert with check (auth.uid() = user_id);
drop policy if exists "attendees_leave" on public.bloom_trip_attendees;
create policy "attendees_leave"       on public.bloom_trip_attendees for delete using  (auth.uid() = user_id);

create index if not exists trips_departure_idx on public.bloom_trips(departure_date asc);
create index if not exists trips_organizer_idx on public.bloom_trips(organizer_id);
-- 036_wellness.sql
-- The Health Bar: wellness posts (juice, smoothie, meal, tips, skincare)
-- with per-user saves that surface in the apartment.

create table if not exists public.wellness_posts (
  id             uuid         primary key default gen_random_uuid(),
  author_id      uuid         not null references public.profiles(id) on delete cascade,
  category       text         not null default 'juice'
                              check (category in ('juice','smoothie','meal','tip','skincare')),
  title          text         not null,
  content        text,
  ingredients    text[]       not null default '{}',
  steps          text[]       not null default '{}',
  image_url      text,
  saves_count    integer      not null default 0,
  created_at     timestamptz  not null default now()
);

create table if not exists public.wellness_saves (
  id         uuid         primary key default gen_random_uuid(),
  post_id    uuid         not null references public.wellness_posts(id) on delete cascade,
  user_id    uuid         not null references public.profiles(id)      on delete cascade,
  created_at timestamptz  not null default now(),
  unique (post_id, user_id)
);

-- Indexes
create index if not exists wellness_posts_author   on public.wellness_posts(author_id);
create index if not exists wellness_posts_category on public.wellness_posts(category);
create index if not exists wellness_posts_created  on public.wellness_posts(created_at desc);
create index if not exists wellness_saves_user     on public.wellness_saves(user_id);
create index if not exists wellness_saves_post     on public.wellness_saves(post_id);

-- RLS
alter table public.wellness_posts enable row level security;
drop policy if exists "wellness_posts_read_all"    on public.wellness_posts;
drop policy if exists "wellness_posts_insert_own"  on public.wellness_posts;
drop policy if exists "wellness_posts_delete_own"  on public.wellness_posts;
drop policy if exists "wellness_posts_read_all" on public.wellness_posts;
create policy "wellness_posts_read_all"   on public.wellness_posts for select using (true);
drop policy if exists "wellness_posts_insert_own" on public.wellness_posts;
create policy "wellness_posts_insert_own" on public.wellness_posts for insert with check (auth.uid() = author_id);
drop policy if exists "wellness_posts_delete_own" on public.wellness_posts;
create policy "wellness_posts_delete_own" on public.wellness_posts for delete using (auth.uid() = author_id);

alter table public.wellness_saves enable row level security;
drop policy if exists "wellness_saves_read_own"   on public.wellness_saves;
drop policy if exists "wellness_saves_insert_own" on public.wellness_saves;
drop policy if exists "wellness_saves_delete_own" on public.wellness_saves;
drop policy if exists "wellness_saves_read_own" on public.wellness_saves;
create policy "wellness_saves_read_own"   on public.wellness_saves for select using (auth.uid() = user_id);
drop policy if exists "wellness_saves_insert_own" on public.wellness_saves;
create policy "wellness_saves_insert_own" on public.wellness_saves for insert with check (auth.uid() = user_id);
drop policy if exists "wellness_saves_delete_own" on public.wellness_saves;
create policy "wellness_saves_delete_own" on public.wellness_saves for delete using (auth.uid() = user_id);

-- Keep saves_count in sync
create or replace function public.sync_wellness_saves_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.wellness_posts set saves_count = saves_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.wellness_posts set saves_count = greatest(0, saves_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$;

DO $$ BEGIN drop trigger if exists wellness_saves_count_sync on public.wellness_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
DO $$ BEGIN drop trigger if exists wellness_saves_count_sync on public.wellness_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger wellness_saves_count_sync
  after insert or delete on public.wellness_saves
  for each row execute function public.sync_wellness_saves_count();
-- Flowers: the Bloombay reaction system (instead of likes).
-- Members give flowers to events, profiles, and clubs.

-- Event flowers (give a flower to a gathering/happening)
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

-- Profile flowers (give a flower to a member's profile — e.g. after witnessing her at an event)
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

-- Notify the recipient when they receive a profile flower
create or replace function public.notify_profile_flower()
returns trigger language plpgsql security definer as $$
begin
  if new.profile_id <> new.user_id then
    perform public.create_notification(
      new.profile_id,
      'flower',
      'Someone sent you flowers 🌸',
      coalesce(new.message, 'A Bloomie sent you flowers.'),
      '/member/lounge',
      jsonb_build_object('from_user_id', new.user_id, 'flower_type', new.flower_type)
    );
  end if;
  return new;
end;
$$;

DO $$ BEGIN drop trigger if exists profile_flower_notify on public.profile_flowers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger profile_flower_notify
  after insert on public.profile_flowers
  for each row execute function public.notify_profile_flower();

-- Indexes
create index if not exists gathering_flowers_gathering_idx on public.gathering_flowers(gathering_id);
create index if not exists gathering_flowers_user_idx     on public.gathering_flowers(user_id);
create index if not exists profile_flowers_profile_idx   on public.profile_flowers(profile_id, created_at desc);
create index if not exists profile_flowers_user_idx      on public.profile_flowers(user_id, created_at desc);
-- Traditions: recurring event series that can graduate to clubs.
-- Gathering → Tradition → Club is the BloomBay growth pipeline.

-- Add host_id to gatherings so we can do reputation queries
alter table public.gatherings
  add column if not exists host_id uuid references public.profiles(id) on delete set null;

-- Add tradition_id to gatherings to link them to a series
alter table public.gatherings
  add column if not exists tradition_id uuid;

-- Traditions table
create table if not exists public.traditions (
  id            uuid primary key default gen_random_uuid(),
  host_id       uuid not null references public.profiles(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  description   text,
  frequency     text not null default 'monthly'
    check (frequency in ('weekly','biweekly','monthly','seasonal','irregular')),
  neighborhood  text,
  cover_url     text,
  primary_color text default '#FF1F7D',
  status        text not null default 'active'
    check (status in ('active','paused','became_club')),
  club_id       uuid references public.clubs(id) on delete set null,
  gathering_count int not null default 0,
  follower_count  int not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.tradition_followers (
  tradition_id  uuid not null references public.traditions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (tradition_id, user_id)
);

-- RLS
alter table public.traditions       enable row level security;
alter table public.tradition_followers enable row level security;

drop policy if exists "traditions_read_all" on public.traditions;
create policy "traditions_read_all"
  on public.traditions for select using (true);

drop policy if exists "traditions_insert_own" on public.traditions;
create policy "traditions_insert_own"
  on public.traditions for insert with check (auth.uid() = host_id);

drop policy if exists "traditions_update_own" on public.traditions;
create policy "traditions_update_own"
  on public.traditions for update using (auth.uid() = host_id);

drop policy if exists "tradition_followers_read_all" on public.tradition_followers;
create policy "tradition_followers_read_all"
  on public.tradition_followers for select using (true);

drop policy if exists "tradition_followers_insert_own" on public.tradition_followers;
create policy "tradition_followers_insert_own"
  on public.tradition_followers for insert with check (auth.uid() = user_id);

drop policy if exists "tradition_followers_delete_own" on public.tradition_followers;
create policy "tradition_followers_delete_own"
  on public.tradition_followers for delete using (auth.uid() = user_id);

-- Keep follower_count in sync
create or replace function public.sync_tradition_follower_count()
returns trigger language plpgsql security definer as $$
begin
  if TG_OP = 'INSERT' then
    update public.traditions set follower_count = follower_count + 1 where id = new.tradition_id;
  elsif TG_OP = 'DELETE' then
    update public.traditions set follower_count = greatest(0, follower_count - 1) where id = old.tradition_id;
  end if;
  return coalesce(new, old);
end;
$$;

DO $$ BEGIN drop trigger if exists tradition_follower_count_sync on public.tradition_followers; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger tradition_follower_count_sync
  after insert or delete on public.tradition_followers
  for each row execute function public.sync_tradition_follower_count();

-- Indexes
create index if not exists traditions_host_idx       on public.traditions(host_id);
create index if not exists traditions_slug_idx       on public.traditions(slug);
create index if not exists tradition_followers_user  on public.tradition_followers(user_id);
create index if not exists gatherings_host_idx       on public.gatherings(host_id);
create index if not exists gatherings_tradition_idx  on public.gatherings(tradition_id);
-- Women's City Intelligence: structured insight tags on bloom notes.
-- New-in-Town layer: arrival status on profiles.

-- Structured insight tags for bloom notes
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

-- New-in-Town layer on profiles
alter table public.profiles
  add column if not exists arrival_status text
    check (arrival_status in ('just_moved','new_6mo','fresh_start','local','native'));

-- Indexes
create index if not exists bloom_note_tags_note_idx on public.bloom_note_tags(note_id);
create index if not exists bloom_note_tags_tag_idx  on public.bloom_note_tags(tag);
create index if not exists profiles_arrival_idx     on public.profiles(arrival_status) where arrival_status is not null;
-- Bloomies Planner™: group plans with RSVP and built-in group chat

CREATE TABLE IF NOT EXISTS bloomies_plans (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        text NOT NULL,
  plan_type    text NOT NULL DEFAULT 'hangout'
               CHECK (plan_type IN ('dinner','birthday','hangout','trip','brunch','other')),
  description  text,
  date_time    timestamptz,
  venue        text,
  status       text NOT NULL DEFAULT 'active'
               CHECK (status IN ('active','cancelled','completed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bloomies_plan_invites (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id      uuid NOT NULL REFERENCES bloomies_plans(id) ON DELETE CASCADE,
  invitee_id   uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rsvp_status  text NOT NULL DEFAULT 'pending'
               CHECK (rsvp_status IN ('pending','yes','maybe','no')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(plan_id, invitee_id)
);

CREATE TABLE IF NOT EXISTS bloomies_plan_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    uuid NOT NULL REFERENCES bloomies_plans(id) ON DELETE CASCADE,
  sender_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (char_length(content) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bloomies_plans_creator   ON bloomies_plans(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bloomies_invites_plan    ON bloomies_plan_invites(plan_id);
CREATE INDEX IF NOT EXISTS idx_bloomies_invites_invitee ON bloomies_plan_invites(invitee_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bloomies_messages_plan   ON bloomies_plan_messages(plan_id, created_at);

-- RLS
ALTER TABLE bloomies_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloomies_plan_invites  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloomies_plan_messages ENABLE ROW LEVEL SECURITY;

-- Plans: visible to creator + invitees
DROP POLICY IF EXISTS "plan_select" ON bloomies_plans;
CREATE POLICY "plan_select" ON bloomies_plans FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = id AND invitee_id = auth.uid())
  );
DROP POLICY IF EXISTS "plan_insert" ON bloomies_plans;
CREATE POLICY "plan_insert" ON bloomies_plans FOR INSERT WITH CHECK (auth.uid() = creator_id);
DROP POLICY IF EXISTS "plan_update" ON bloomies_plans;
CREATE POLICY "plan_update" ON bloomies_plans FOR UPDATE USING (auth.uid() = creator_id);
DROP POLICY IF EXISTS "plan_delete" ON bloomies_plans;
CREATE POLICY "plan_delete" ON bloomies_plans FOR DELETE USING (auth.uid() = creator_id);

-- Invites: creator can manage; invitees can update own RSVP and see all for the plan
DROP POLICY IF EXISTS "invite_select" ON bloomies_plan_invites;
CREATE POLICY "invite_select" ON bloomies_plan_invites FOR SELECT
  USING (
    invitee_id = auth.uid()
    OR EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
  );
DROP POLICY IF EXISTS "invite_insert" ON bloomies_plan_invites;
CREATE POLICY "invite_insert" ON bloomies_plan_invites FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid()));
DROP POLICY IF EXISTS "invite_update_rsvp" ON bloomies_plan_invites;
CREATE POLICY "invite_update_rsvp" ON bloomies_plan_invites FOR UPDATE
  USING (invitee_id = auth.uid());

-- Messages: visible to plan members; plan members can send
DROP POLICY IF EXISTS "msg_select" ON bloomies_plan_messages;
CREATE POLICY "msg_select" ON bloomies_plan_messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
    OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
  );
DROP POLICY IF EXISTS "msg_insert" ON bloomies_plan_messages;
CREATE POLICY "msg_insert" ON bloomies_plan_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND (
      EXISTS (SELECT 1 FROM bloomies_plans WHERE id = plan_id AND creator_id = auth.uid())
      OR EXISTS (SELECT 1 FROM bloomies_plan_invites WHERE plan_id = bloomies_plan_messages.plan_id AND invitee_id = auth.uid())
    )
  );
-- ── Missing: club_memberships RLS policies ────────────────────────────────────
-- RLS was enabled in migration 024 but policies were never written.

drop policy if exists "memberships_read_all" on public.club_memberships;
drop policy if exists "memberships_read_all" on public.club_memberships;
create policy "memberships_read_all"
  on public.club_memberships for select using (true);

drop policy if exists "memberships_join" on public.club_memberships;
drop policy if exists "memberships_join" on public.club_memberships;
create policy "memberships_join"
  on public.club_memberships for insert
  with check (auth.uid() = user_id);

drop policy if exists "memberships_leave" on public.club_memberships;
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

drop policy if exists "checkins_read_event" on public.event_checkins;
create policy "checkins_read_event"
  on public.event_checkins for select
  using (true);                               -- anyone at the event can see who checked in

drop policy if exists "checkins_own" on public.event_checkins;
create policy "checkins_own"
  on public.event_checkins for insert
  with check (auth.uid() = user_id);

drop policy if exists "checkins_delete_own" on public.event_checkins;
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

drop policy if exists "scans_read_own" on public.friend_scans;
create policy "scans_read_own"
  on public.friend_scans for select
  using (auth.uid() = initiator_id or auth.uid() = scanned_id);

drop policy if exists "scans_write_own" on public.friend_scans;
create policy "scans_write_own"
  on public.friend_scans for insert
  with check (auth.uid() = initiator_id);
-- ── GirlMate: extend profiles to support rich listing types ──────────────────
-- The original girlmate_profiles table only had basic roommate fields.
-- This adds everything the UI needs: listing type, city, price, furnished, etc.

alter table public.girlmate_profiles
  add column if not exists display_name      text,
  add column if not exists listing_type      text not null default 'roommate-wanted'
    check (listing_type in ('room','apartment','roommate-wanted','co-search')),
  add column if not exists city              text not null default 'New York',
  add column if not exists neighborhood_name text,          -- human label e.g. "Williamsburg"
  add column if not exists price_cents       integer,       -- monthly rent/budget in cents
  add column if not exists available_from    date,
  add column if not exists available_to      date,          -- null = open-ended
  add column if not exists furnished         boolean default false,
  add column if not exists private_bathroom  boolean default false,
  add column if not exists weed_ok           boolean default false,
  add column if not exists halal_kitchen     boolean default false,
  add column if not exists wfh_friendly      boolean default false,
  add column if not exists partner_ok        boolean default false,
  add column if not exists show_profile      boolean default true,  -- link to BB profile
  add column if not exists description       text,
  add column if not exists yande_note        text,          -- AI-generated match note
  add column if not exists image_url         text;

-- Index for city-level queries (global listings)
create index if not exists girlmate_city_idx  on public.girlmate_profiles(city, is_active);
create index if not exists girlmate_type_idx  on public.girlmate_profiles(listing_type, is_active);
-- ── City Trending: live "what's hot" feed for the City section ───────────────
-- Curators submit trending spots/moments. Admin approves.
-- Replaces the hardcoded TREND_LIST in city-page.tsx.

create table if not exists public.city_trending (
  id           uuid primary key default gen_random_uuid(),
  city         text not null default 'New York',  -- global-ready
  neighborhood text,
  name         text not null,                      -- "Dior Café Pop-Up on Madison"
  category     text not null
    check (category in ('dining','drinks','pop-up','art','nightlife','brunch','coffee','shopping','wellness','event','other')),
  description  text,                               -- 1-2 sentences
  source       text,                               -- "Eater NYC", "Time Out", "Vogue", "Bloomie tip", "Instagram"
  source_url   text,                               -- link to the article/post
  image_url    text,
  badge        text,                               -- "NEW", "MOST SAVED", "SELLING OUT", null
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,
  week_of      date not null default current_date, -- which week this is trending for
  rank_order   smallint default 99,                -- manual sort order within the week
  save_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists trending_city_week_idx on public.city_trending(city, week_of desc, status, rank_order);

alter table public.city_trending enable row level security;

-- Public can read approved items
drop policy if exists "trending_read_approved" on public.city_trending;
create policy "trending_read_approved"
  on public.city_trending for select
  using (status = 'approved');

-- Curators and admins can submit
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

-- Admins/founders can approve and update
drop policy if exists "trending_manage" on public.city_trending;
create policy "trending_manage"
  on public.city_trending for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin','founder')
    )
  );

-- ── City Trending Saves: women save trending spots ────────────────────────────
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

-- Auto-increment save_count when a woman saves a trending spot
create or replace function public.inc_trending_saves()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.city_trending set save_count = save_count + 1 where id = NEW.trending_id;
  elsif TG_OP = 'DELETE' then
    update public.city_trending set save_count = greatest(0, save_count - 1) where id = OLD.trending_id;
  end if;
  return null;
end;
$$;

DO $$ BEGIN drop trigger if exists trending_saves_count on public.city_trending_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger trending_saves_count
  after insert or delete on public.city_trending_saves
  for each row execute function public.inc_trending_saves();
-- ── Avenue Weekly Content ─────────────────────────────────────────────────────
-- Each Avenue room has weekly content curated by its AI editor.
-- Human curator reviews and approves before it goes live.
-- Replaces all hardcoded mock arrays in the Avenue page components.

create table if not exists public.avenue_content (
  id           uuid primary key default gen_random_uuid(),

  -- Which room this content belongs to
  room         text not null
    check (room in ('magazine','book','screening','wellness','hanger','vanity','wall','shop','city')),

  -- Content shape varies by room — stored as flexible JSON
  content_type text not null,  -- 'article', 'book_rec', 'film_rec', 'wellness_tip', 'style_pick', 'beauty_tip', 'community_prompt', 'product_rec', 'place'

  -- Core fields (all rooms)
  title        text not null,
  body         text,            -- main content / description
  image_url    text,
  source       text,            -- "AI-generated", "Eater NYC", "TikTok", "Curator", etc.
  source_url   text,

  -- Structured extras as JSON (room-specific fields)
  -- Magazine: { section, dek, read_time, author }
  -- Book: { book_author, rating, why, isbn }
  -- Screening: { where_to_watch, genre, runtime }
  -- Wellness: { ingredients, steps, category }
  -- Hanger/Vanity: { price, brand, buy_url }
  -- City: { neighborhood, category, badge }
  meta         jsonb default '{}',

  -- Editorial
  yande_note   text,           -- AI-written one-liner
  badge        text,           -- "NEW", "TRENDING", "STAFF PICK", "THIS WEEK", null
  week_of      date not null default current_date,
  rank_order   smallint default 99,

  -- Workflow
  status       text not null default 'pending'
    check (status in ('pending','approved','archived')),
  submitted_by uuid references public.profiles(id) on delete set null,  -- null = AI-generated
  approved_by  uuid references public.profiles(id) on delete set null,
  approved_at  timestamptz,

  -- Engagement
  save_count   integer not null default 0,
  like_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists avenue_content_room_week_idx on public.avenue_content(room, week_of desc, status, rank_order);
create index if not exists avenue_content_status_idx    on public.avenue_content(status, room, week_of desc);

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

-- ── Avenue Content Saves ──────────────────────────────────────────────────────
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

-- Auto-increment save_count
create or replace function public.inc_avenue_saves()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.avenue_content set save_count = save_count + 1 where id = NEW.content_id;
  elsif TG_OP = 'DELETE' then
    update public.avenue_content set save_count = greatest(0, save_count - 1) where id = OLD.content_id;
  end if;
  return null;
end;
$$;

DO $$ BEGIN drop trigger if exists avenue_saves_count on public.avenue_content_saves; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger avenue_saves_count
  after insert or delete on public.avenue_content_saves
  for each row execute function public.inc_avenue_saves();
-- Editor Instructions: founder's taste profile for each AI editor
-- Each editor (magazine, wellness, hanger, etc.) builds up a library of:
--   voice      → how to sound, who to write like, tone rules
--   reference  → article text or summary the founder loved — learn this style
--   correction → a specific piece the founder edited, with the "right" version
--   feedback   → general feedback on recent output ("too formal", "more attitude")

create table public.editor_instructions (
  id              uuid        primary key default gen_random_uuid(),
  editor_name     text        not null,   -- magazine | wellness | hanger | vanity | wall | reading-room | screening | working | column
  instruction_type text       not null check (instruction_type in ('voice', 'reference', 'correction', 'feedback')),
  instruction     text        not null,   -- the actual content (rule, article text, feedback)
  reference_title text,                   -- optional: title of a reference article
  original_content text,                  -- for corrections: what the editor wrote
  edited_content  text,                   -- for corrections: what the founder changed it to
  active          boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index for fast lookup per editor (cron uses this every run)
create index idx_editor_instructions_editor on public.editor_instructions (editor_name, active);

-- Only admins/service role can manage editor instructions
alter table public.editor_instructions enable row level security;

drop policy if exists "editor_instructions_service_only" on public.editor_instructions;
create policy "editor_instructions_service_only"
  on public.editor_instructions
  using (false);  -- no public access; cron uses service role key

-- Trigger to keep updated_at fresh
create or replace function update_editor_instructions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

DO $$ BEGIN drop trigger if exists trg_editor_instructions_updated_at on public.editor_instructions; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger trg_editor_instructions_updated_at
  before update on public.editor_instructions
  for each row execute function update_editor_instructions_updated_at();
-- ── Launch Blockers Migration ──────────────────────────────────────────────────
-- 1. Add membership columns to profiles
-- 2. Create member_applications table (waitlist/apply queue)
-- 3. Create wall_posts + wall_post_blooms tables

-- ── 1. Profiles: membership tracking ─────────────────────────────────────────
alter table public.profiles
  add column if not exists is_member            boolean     not null default false,
  add column if not exists membership_started_at timestamptz,
  add column if not exists membership_type       text;       -- 'platform' | null

-- ── 2. Member applications ────────────────────────────────────────────────────
create table if not exists public.member_applications (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users(id) on delete set null,
  email           text,
  name            text        not null,
  first_name      text,
  neighborhood    text,
  age             text,
  city            text        not null default 'New York City',
  bio             text,
  vibe            text,
  goals           text[]      not null default '{}',
  interests       text[]      not null default '{}',
  founding_mother boolean     not null default false,
  photo_url       text,
  status          text        not null default 'pending'
                              check (status in ('pending', 'approved', 'declined')),
  decline_note    text,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     text
);

alter table public.member_applications enable row level security;
-- Only service role can access
drop policy if exists "member_apps_service_only" on public.member_applications;
create policy "member_apps_service_only"
  on public.member_applications using (false);

create index if not exists member_apps_status_idx
  on public.member_applications (status, submitted_at desc);

-- ── 3. The Wall: posts + blooms ───────────────────────────────────────────────
create table if not exists public.wall_posts (
  id          uuid        primary key default gen_random_uuid(),
  author_id   uuid        not null references public.profiles(id) on delete cascade,
  category    text        not null default 'mood'
              check (category in ('mood', 'connects', 'wins', 'questions', 'rant')),
  text        text        not null,
  blooms      integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.wall_posts enable row level security;

drop policy if exists "wall_read_all" on public.wall_posts;
create policy "wall_read_all"
  on public.wall_posts for select using (true);

drop policy if exists "wall_insert_own" on public.wall_posts;
create policy "wall_insert_own"
  on public.wall_posts for insert with check (auth.uid() = author_id);

drop policy if exists "wall_delete_own" on public.wall_posts;
create policy "wall_delete_own"
  on public.wall_posts for delete using (auth.uid() = author_id);

-- Bloom reactions
create table if not exists public.wall_post_blooms (
  post_id     uuid        not null references public.wall_posts(id) on delete cascade,
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.wall_post_blooms enable row level security;

drop policy if exists "wblooms_read_all" on public.wall_post_blooms;
create policy "wblooms_read_all"
  on public.wall_post_blooms for select using (true);

drop policy if exists "wblooms_insert_own" on public.wall_post_blooms;
create policy "wblooms_insert_own"
  on public.wall_post_blooms for insert with check (auth.uid() = user_id);

drop policy if exists "wblooms_delete_own" on public.wall_post_blooms;
create policy "wblooms_delete_own"
  on public.wall_post_blooms for delete using (auth.uid() = user_id);

-- Keep denormalized bloom count in sync via triggers
create or replace function public.increment_wall_bloom()
returns trigger language plpgsql security definer as $$
begin
  update public.wall_posts set blooms = blooms + 1 where id = new.post_id;
  return new;
end;
$$;

create or replace function public.decrement_wall_bloom()
returns trigger language plpgsql security definer as $$
begin
  update public.wall_posts set blooms = greatest(0, blooms - 1) where id = old.post_id;
  return old;
end;
$$;

DO $$ BEGIN drop trigger if exists wall_bloom_up on public.wall_post_blooms; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger wall_bloom_up
  after insert on public.wall_post_blooms
  for each row execute function public.increment_wall_bloom();

DO $$ BEGIN drop trigger if exists wall_bloom_down on public.wall_post_blooms; EXCEPTION WHEN undefined_table THEN NULL; END $$;
create trigger wall_bloom_down
  after delete on public.wall_post_blooms
  for each row execute function public.decrement_wall_bloom();

create index if not exists wall_posts_created_idx  on public.wall_posts(created_at desc);
create index if not exists wall_posts_category_idx on public.wall_posts(category, created_at desc);
-- Allow seed posts from the platform (Yande / BloomBay voice)
-- author_id nullable so service role can insert without a real user

alter table public.wall_posts
  alter column author_id drop not null,
  add column if not exists is_seed     boolean not null default false,
  add column if not exists seed_author text;   -- display name for seed posts e.g. "Yande ✦"

-- Update insert policy: users can only insert their own (non-seed) posts
drop policy if exists "wall_insert_own" on public.wall_posts;
drop policy if exists "wall_insert_own" on public.wall_posts;
create policy "wall_insert_own"
  on public.wall_posts for insert
  with check (auth.uid() = author_id AND is_seed = false);
-- Seed posts are inserted by service role (bypasses RLS automatically)
-- Founder Analyst: weekly Yande digest reports
create table if not exists public.founder_analyst_reports (
  id          uuid        primary key default gen_random_uuid(),
  week_of     date        not null unique,
  report_text text        not null,
  raw_data    jsonb,
  created_at  timestamptz not null default now()
);

-- Only service role (cron) can write; founder reads via admin dashboard
alter table public.founder_analyst_reports enable row level security;
drop policy if exists "analyst_reports_service_only" on public.founder_analyst_reports;
create policy "analyst_reports_service_only"
  on public.founder_analyst_reports using (false);
-- ── GirlMate Partner Applications ────────────────────────────────────────────
create table if not exists public.girlmate_partner_applications (
  id            uuid        primary key default gen_random_uuid(),
  contact_name  text        not null,
  email         text        not null,
  group_name    text        not null,
  platform      text        not null default 'other',
  group_size    text,
  cities        text,
  description   text,
  why_partner   text,
  status        text        not null default 'pending'
                            check (status in ('pending', 'approved', 'declined')),
  partner_code  text        unique,   -- generated on approval, used as invite link key
  submitted_at  timestamptz not null default now(),
  reviewed_at   timestamptz,
  reviewed_by   text
);

alter table public.girlmate_partner_applications enable row level security;
drop policy if exists "gm_partner_apps_service_only" on public.girlmate_partner_applications;
create policy "gm_partner_apps_service_only"
  on public.girlmate_partner_applications using (false);

-- ── Yande Memory Layer ────────────────────────────────────────────────────────
-- One note per member per month; powers personalisation and friendship health
create table if not exists public.yande_memories (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references public.profiles(id) on delete cascade,
  month_of   text        not null,  -- "2026-06"
  note       text        not null,  -- Yande's memory note
  raw_data   jsonb,                 -- clubs, wall_posts, blooms counts
  created_at timestamptz not null default now(),
  unique (user_id, month_of)
);

alter table public.yande_memories enable row level security;

-- Members can read their own memories (for future in-app use)
drop policy if exists "memories_own_read" on public.yande_memories;
create policy "memories_own_read"
  on public.yande_memories for select
  using (auth.uid() = user_id);

-- Service role writes (cron bypasses RLS automatically)

create index if not exists yande_memories_user_idx on public.yande_memories(user_id, month_of desc);
-- Friendship Health: tracks who attends events together
-- Score = co_attendance × 10 + friend_scans × 25
-- user_a < user_b enforces canonical pair ordering (no duplicates)

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
-- 051 — GirlMate standalone user accounts + messaging

-- Flag GirlMate-only users so proxy can route them correctly
alter table public.profiles add column if not exists girlmate_user boolean not null default false;

-- GirlMate direct messages (user contacts listing owner)
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
-- User feedback / bug reports
create table if not exists public.user_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  page_url    text,
  category    text not null default 'bug',  -- 'bug' | 'feature' | 'compliment' | 'other'
  priority    text not null default 'normal', -- 'urgent' | 'normal' | 'low'
  message     text not null,
  device_info text,
  status      text not null default 'open',  -- 'open' | 'in_review' | 'resolved' | 'wont_fix'
  assigned_to text,  -- agent/employee name
  admin_notes text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.user_feedback enable row level security;

-- Users can insert their own feedback
drop policy if exists "users_insert_feedback" on public.user_feedback;
create policy "users_insert_feedback" on public.user_feedback
  for insert with check (auth.uid() = user_id or user_id is null);

-- Admins/founders can see and update all feedback
drop policy if exists "admin_manage_feedback" on public.user_feedback;
create policy "admin_manage_feedback" on public.user_feedback
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'founder')
    )
  );

-- Site health reports from automated agents
create table if not exists public.site_health_reports (
  id          uuid primary key default gen_random_uuid(),
  agent_name  text not null,     -- e.g. 'Aria', 'Nova', 'Quinn'
  area        text not null,     -- e.g. 'girlmate', 'member_portal', 'performance'
  status      text not null,     -- 'healthy' | 'warning' | 'critical'
  summary     text not null,
  details     jsonb,
  action_taken text,
  needs_approval boolean not null default false,
  approval_status text,          -- null | 'pending' | 'approved' | 'rejected'
  created_at  timestamptz not null default now()
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

-- Index for fast recent lookups
create index if not exists idx_feedback_status on public.user_feedback(status, created_at desc);
create index if not exists idx_health_created on public.site_health_reports(created_at desc);
-- Waitlist table for BloomBay pre-launch lead capture
create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null unique,
  first_name   text,
  phone_number text,
  city         text,
  goals        text[] default '{}',
  status       text not null default 'waiting',  -- waiting | invited | joined
  invited_at   timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Only service role can read/write (admin operations)
-- Users cannot directly read the waitlist
drop policy if exists "service_role_all" on public.waitlist;
create policy "service_role_all" on public.waitlist
  for all using (false) with check (false);
-- Purchase/transaction ledger for BloomBay
-- Records every completed payment across all types
create table if not exists public.purchases (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles(id) on delete set null,
  type                text not null,            -- membership | ticket | club_membership | hanger_purchase
  stripe_session_id   text,
  stripe_payment_intent text,
  amount_cents        integer,
  currency            text not null default 'gbp',
  item_name           text,                      -- human-readable item/event/club name
  item_id             text,                      -- event_id | club_id | listing_id | null
  status              text not null default 'completed',
  created_at          timestamptz not null default now()
);

create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_created_at_idx on public.purchases(created_at desc);

alter table public.purchases enable row level security;

-- Users can only read their own purchases
drop policy if exists "users_read_own_purchases" on public.purchases;
create policy "users_read_own_purchases" on public.purchases
  for select using (auth.uid() = user_id);

-- Service role inserts (via webhook)
drop policy if exists "service_insert_purchases" on public.purchases;
create policy "service_insert_purchases" on public.purchases
  for insert with check (true);

-- Hanger seller earnings view
-- Shows the seller side: for each hanger_purchase, seller receives 90% of sale price
create or replace view public.hanger_earnings as
  select
    p.id,
    p.user_id as buyer_id,
    hl.seller_id,
    p.item_name,
    p.item_id as listing_id,
    p.amount_cents,
    round(p.amount_cents * 0.90)::integer as seller_receives_cents,
    round(p.amount_cents * 0.10)::integer as bloombay_fee_cents,
    p.created_at
  from public.purchases p
  join public.hanger_listings hl on hl.id = p.item_id::uuid
  where p.type = 'hanger_purchase'
    and p.status = 'completed';
create table if not exists public.pin_drops (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  location     text not null,
  caption      text,
  expires_at   timestamptz not null,
  created_at   timestamptz not null default now()
);

create table if not exists public.pin_drop_joins (
  id           uuid primary key default gen_random_uuid(),
  pin_id       uuid references public.pin_drops(id) on delete cascade not null,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  joined_at    timestamptz not null default now(),
  unique(pin_id, user_id)
);

alter table public.pin_drops enable row level security;
alter table public.pin_drop_joins enable row level security;

-- Members can see all active pins
drop policy if exists "members_read_pins" on public.pin_drops;
create policy "members_read_pins" on public.pin_drops
  for select using (expires_at > now());
-- Members insert their own pins
drop policy if exists "members_insert_pins" on public.pin_drops;
create policy "members_insert_pins" on public.pin_drops
  for insert with check (auth.uid() = user_id);
-- Members can join pins
drop policy if exists "members_join_pins" on public.pin_drop_joins;
create policy "members_join_pins" on public.pin_drop_joins
  for insert with check (auth.uid() = user_id);
drop policy if exists "members_read_joins" on public.pin_drop_joins;
create policy "members_read_joins" on public.pin_drop_joins
  for select using (true);
create table if not exists public.table_reservations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles(id) on delete set null,
  restaurant_id text not null,
  restaurant_name text not null,
  date          date not null,
  time          text not null,          -- "7:00 PM"
  party_size    integer not null default 2,
  notes         text,
  status        text not null default 'pending',  -- pending | confirmed | cancelled | seated
  confirmed_at  timestamptz,
  cancelled_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists table_reservations_user_id_idx on public.table_reservations(user_id);
create index if not exists table_reservations_restaurant_id_idx on public.table_reservations(restaurant_id);
create index if not exists table_reservations_date_idx on public.table_reservations(date);

alter table public.table_reservations enable row level security;

-- Users can read their own reservations
drop policy if exists "users_read_own_reservations" on public.table_reservations;
create policy "users_read_own_reservations" on public.table_reservations
  for select using (auth.uid() = user_id);
-- Users can create reservations
drop policy if exists "users_insert_reservations" on public.table_reservations;
create policy "users_insert_reservations" on public.table_reservations
  for insert with check (auth.uid() = user_id);
-- Service role manages all
drop policy if exists "service_manages_reservations" on public.table_reservations;
create policy "service_manages_reservations" on public.table_reservations
  for all using (true) with check (true);
