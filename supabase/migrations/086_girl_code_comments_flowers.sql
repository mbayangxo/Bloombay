-- ── Girl Code sequential member numbers ──────────────────────────────────────
-- Each member gets a unique sequential number starting from 1.
-- #1 is reserved for the founding account (mbayangskin@gmail.com).

create sequence if not exists public.girl_code_seq start 1;

alter table public.profiles
  add column if not exists girl_code integer unique;

-- Auto-assign girl_code on new profile creation
create or replace function public.assign_girl_code()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.girl_code is null then
    new.girl_code := nextval('public.girl_code_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists assign_girl_code_trigger on public.profiles;
create trigger assign_girl_code_trigger
  before insert on public.profiles
  for each row execute function public.assign_girl_code();

-- Founder gets #1 (backfill for the first account created)
-- Run once: UPDATE profiles SET girl_code = 1 WHERE email = 'mbayangskin@gmail.com';
-- Then: SELECT setval('girl_code_seq', (SELECT COALESCE(MAX(girl_code), 1) FROM profiles));


-- ── Post comments ─────────────────────────────────────────────────────────────
-- Unified comment system across: fashion_posts, wall_posts, avenue_content, wellness_posts

create table if not exists public.post_comments (
  id            uuid        primary key default gen_random_uuid(),
  author_id     uuid        not null references public.profiles(id) on delete cascade,

  -- Polymorphic: one of these will be set
  fashion_post_id   uuid    references public.fashion_posts(id) on delete cascade,
  wall_post_id      uuid    references public.wall_posts(id) on delete cascade,
  avenue_content_id uuid    references public.avenue_content(id) on delete cascade,

  -- Threading: if set, this is a reply to another comment
  parent_id     uuid        references public.post_comments(id) on delete cascade,

  body          text        not null,
  blooms        integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint one_post_ref check (
    (fashion_post_id is not null)::int +
    (wall_post_id is not null)::int +
    (avenue_content_id is not null)::int = 1
  )
);

create index if not exists post_comments_fashion_idx  on public.post_comments(fashion_post_id, created_at);
create index if not exists post_comments_wall_idx     on public.post_comments(wall_post_id, created_at);
create index if not exists post_comments_avenue_idx   on public.post_comments(avenue_content_id, created_at);
create index if not exists post_comments_parent_idx   on public.post_comments(parent_id, created_at);
create index if not exists post_comments_author_idx   on public.post_comments(author_id);

alter table public.post_comments enable row level security;

drop policy if exists "comments_read" on public.post_comments;
create policy "comments_read" on public.post_comments for select using (true);

drop policy if exists "comments_insert_own" on public.post_comments;
create policy "comments_insert_own" on public.post_comments
  for insert with check (auth.uid() = author_id);

drop policy if exists "comments_delete_own" on public.post_comments;
create policy "comments_delete_own" on public.post_comments
  for delete using (auth.uid() = author_id);


-- ── Flowers (post reactions) ──────────────────────────────────────────────────
-- A user can send one flower per post. One row = one flower.

create table if not exists public.post_flowers (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,

  fashion_post_id   uuid    references public.fashion_posts(id) on delete cascade,
  wall_post_id      uuid    references public.wall_posts(id) on delete cascade,
  avenue_content_id uuid    references public.avenue_content(id) on delete cascade,

  created_at    timestamptz not null default now(),

  constraint flowers_one_post_ref check (
    (fashion_post_id is not null)::int +
    (wall_post_id is not null)::int +
    (avenue_content_id is not null)::int = 1
  )
);

-- One flower per user per post
create unique index if not exists post_flowers_fashion_unique
  on public.post_flowers(user_id, fashion_post_id) where fashion_post_id is not null;
create unique index if not exists post_flowers_wall_unique
  on public.post_flowers(user_id, wall_post_id) where wall_post_id is not null;
create unique index if not exists post_flowers_avenue_unique
  on public.post_flowers(user_id, avenue_content_id) where avenue_content_id is not null;

create index if not exists post_flowers_fashion_idx  on public.post_flowers(fashion_post_id);
create index if not exists post_flowers_wall_idx     on public.post_flowers(wall_post_id);
create index if not exists post_flowers_avenue_idx   on public.post_flowers(avenue_content_id);

alter table public.post_flowers enable row level security;

drop policy if exists "flowers_read" on public.post_flowers;
create policy "flowers_read" on public.post_flowers for select using (true);

drop policy if exists "flowers_own" on public.post_flowers;
create policy "flowers_own" on public.post_flowers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);


-- ── Comment flowers ───────────────────────────────────────────────────────────
-- Users can also send a flower to a comment

create table if not exists public.comment_flowers (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  comment_id  uuid        not null references public.post_comments(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, comment_id)
);

alter table public.comment_flowers enable row level security;

drop policy if exists "comment_flowers_read" on public.comment_flowers;
create policy "comment_flowers_read" on public.comment_flowers for select using (true);

drop policy if exists "comment_flowers_own" on public.comment_flowers;
create policy "comment_flowers_own" on public.comment_flowers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
