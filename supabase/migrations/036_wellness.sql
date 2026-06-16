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
create policy "wellness_posts_read_all"   on public.wellness_posts for select using (true);
create policy "wellness_posts_insert_own" on public.wellness_posts for insert with check (auth.uid() = author_id);
create policy "wellness_posts_delete_own" on public.wellness_posts for delete using (auth.uid() = author_id);

alter table public.wellness_saves enable row level security;
drop policy if exists "wellness_saves_read_own"   on public.wellness_saves;
drop policy if exists "wellness_saves_insert_own" on public.wellness_saves;
drop policy if exists "wellness_saves_delete_own" on public.wellness_saves;
create policy "wellness_saves_read_own"   on public.wellness_saves for select using (auth.uid() = user_id);
create policy "wellness_saves_insert_own" on public.wellness_saves for insert with check (auth.uid() = user_id);
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

drop trigger if exists wellness_saves_count_sync on public.wellness_saves;
create trigger wellness_saves_count_sync
  after insert or delete on public.wellness_saves
  for each row execute function public.sync_wellness_saves_count();
