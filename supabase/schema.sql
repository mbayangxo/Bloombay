-- ╔══════════════════════════════════════════════════════════════╗
-- ║  BloomBay — Supabase Schema                                  ║
-- ║  Run this in the Supabase SQL editor once.                   ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── PROFILES ────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                    uuid references auth.users on delete cascade primary key,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  email                 text,
  first_name            text,
  bio                   text,
  avatar_url            text,
  verification_photo_url text,
  role                  text not null default 'member'
    check (role in ('member','founder','admin','club_owner','partner','moderator','curator')),
  -- location
  city                  text default 'New York',
  borough               text,
  neighborhood          text,
  age                   integer check (age >= 18 and age <= 100),
  -- matching data
  goals                 text[] default '{}',
  era                   text,
  interests             text[] default '{}',
  lifestyle             text[] default '{}',
  schedule              text[] default '{}',
  -- verification
  verification_status   text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected')),
  -- onboarding
  onboarding_completed  boolean not null default false,
  onboarding_step       integer not null default 0,
  -- gamification
  bloom_points          integer not null default 0,
  member_number         integer generated always as identity
);

-- auto update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- auto-create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── CLUBS ────────────────────────────────────────────────────────
create table if not exists public.clubs (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  description  text,
  color        text default '#FF1F7D',
  dark_bg      boolean default false,
  member_count integer not null default 0,
  owner_id     uuid references public.profiles(id),
  is_active    boolean not null default true
);

-- ── USER_CLUBS ────────────────────────────────────────────────────
create table if not exists public.user_clubs (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  club_id   uuid not null references public.clubs(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (user_id, club_id)
);

-- keep member_count in sync
create or replace function public.sync_club_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.clubs set member_count = member_count + 1 where id = new.club_id;
  elsif tg_op = 'DELETE' then
    update public.clubs set member_count = greatest(0, member_count - 1) where id = old.club_id;
  end if;
  return null;
end;
$$;
drop trigger if exists user_clubs_count on public.user_clubs;
create trigger user_clubs_count
  after insert or delete on public.user_clubs
  for each row execute function public.sync_club_count();

-- ── INVITES ──────────────────────────────────────────────────────
create table if not exists public.invites (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  inviter_id  uuid references public.profiles(id) on delete cascade,
  email       text not null,
  status      text not null default 'pending'
    check (status in ('pending','accepted','expired'))
);

-- ── MESSAGES (mailbox) ───────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  sender_id   uuid references public.profiles(id) on delete set null,
  recipient_id uuid references public.profiles(id) on delete cascade,
  subject     text,
  body        text not null,
  read        boolean not null default false,
  portal      text default 'member'
    check (portal in ('member','admin','club_owner','partner','curator'))
);

-- ── RLS ──────────────────────────────────────────────────────────
alter table public.profiles    enable row level security;
alter table public.clubs       enable row level security;
alter table public.user_clubs  enable row level security;
alter table public.invites     enable row level security;
alter table public.messages    enable row level security;

-- profiles
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- clubs
create policy "clubs_read_all"      on public.clubs for select using (true);
create policy "clubs_insert_admin"  on public.clubs for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
);
create policy "clubs_update_owner"  on public.clubs for update using (
  owner_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
);

-- user_clubs
create policy "user_clubs_read_all" on public.user_clubs for select using (true);
create policy "user_clubs_join"     on public.user_clubs for insert with check (auth.uid() = user_id);
create policy "user_clubs_leave"    on public.user_clubs for delete using (auth.uid() = user_id);

-- invites
create policy "invites_own"         on public.invites for select using (auth.uid() = inviter_id);
create policy "invites_create"      on public.invites for insert with check (auth.uid() = inviter_id);

-- messages
create policy "messages_read_own"   on public.messages for select using (
  auth.uid() = recipient_id or auth.uid() = sender_id
);
create policy "messages_send"       on public.messages for insert with check (auth.uid() = sender_id);
create policy "messages_update_own" on public.messages for update using (auth.uid() = recipient_id);

-- ── SEED CLUBS ───────────────────────────────────────────────────
insert into public.clubs (id, name, description, color, dark_bg, member_count) values
  ('11111111-1111-1111-1111-111111111111', 'Dinner Society',     'Girls dinners, reservations, and table talks',     '#FF1F7D', false, 312),
  ('22222222-2222-2222-2222-222222222222', 'Museum Girls',       'Culture, art, and city walks together',             '#FF1F7D', false, 187),
  ('33333333-3333-3333-3333-333333333333', 'Book Club',          'Reading, reflection, and good conversations',       '#FF1F7D', false, 156),
  ('44444444-4444-4444-4444-444444444444', 'Wellness Circle',    'Pilates, yoga, and feeling good together',          '#FF1F7D', false, 203),
  ('55555555-5555-5555-5555-555555555555', 'Sunday Walks',       'Morning walks, coffee, and fresh air',              '#FF1F7D', false, 142),
  ('66666666-6666-6666-6666-666666666666', 'Travel Girls',       'Plan trips, share spots, explore together',         '#1A0514', true,   98)
on conflict (id) do nothing;

-- ── STORAGE BUCKETS ──────────────────────────────────────────────
-- Run these in the Supabase dashboard → Storage, or via the API.
-- They cannot be created from the SQL editor.
--
-- Bucket: avatars        (public: true)
-- Bucket: verification   (public: false)
--
-- Storage RLS policies to add manually:
-- avatars bucket — allow users to upload their own:
--   (bucket_id = 'avatars') AND (auth.uid()::text = (storage.foldername(name))[1])
