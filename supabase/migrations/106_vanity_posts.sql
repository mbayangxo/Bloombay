-- 106_vanity_posts.sql
-- The Vanity: real member-submitted beauty posts (skincare, makeup, hair,
-- fragrance, nails) with per-user saves — mirrors 036_wellness.sql's shape
-- for Girl Fit. Replaces the AI-editorial avenue_content feed, which had no
-- real author behind it.

create table if not exists public.vanity_posts (
  id             uuid         primary key default gen_random_uuid(),
  author_id      uuid         not null references public.profiles(id) on delete cascade,
  category       text         not null default 'skincare'
                              check (category in ('skincare','makeup','haircare','fragrance','nails')),
  title          text         not null,
  content        text,
  products       text[]       not null default '{}',
  image_url      text,
  saves_count    integer      not null default 0,
  created_at     timestamptz  not null default now()
);

create table if not exists public.vanity_saves (
  id         uuid         primary key default gen_random_uuid(),
  post_id    uuid         not null references public.vanity_posts(id) on delete cascade,
  user_id    uuid         not null references public.profiles(id)     on delete cascade,
  created_at timestamptz  not null default now(),
  unique (post_id, user_id)
);

create index if not exists vanity_posts_author   on public.vanity_posts(author_id);
create index if not exists vanity_posts_category on public.vanity_posts(category);
create index if not exists vanity_posts_created  on public.vanity_posts(created_at desc);
create index if not exists vanity_saves_user     on public.vanity_saves(user_id);
create index if not exists vanity_saves_post     on public.vanity_saves(post_id);

alter table public.vanity_posts enable row level security;
drop policy if exists "vanity_posts_read_all"   on public.vanity_posts;
drop policy if exists "vanity_posts_insert_own" on public.vanity_posts;
drop policy if exists "vanity_posts_delete_own" on public.vanity_posts;
create policy "vanity_posts_read_all"   on public.vanity_posts for select using (true);
create policy "vanity_posts_insert_own" on public.vanity_posts for insert with check (auth.uid() = author_id);
create policy "vanity_posts_delete_own" on public.vanity_posts for delete using (auth.uid() = author_id);

alter table public.vanity_saves enable row level security;
drop policy if exists "vanity_saves_read_own"   on public.vanity_saves;
drop policy if exists "vanity_saves_insert_own" on public.vanity_saves;
drop policy if exists "vanity_saves_delete_own" on public.vanity_saves;
create policy "vanity_saves_read_own"   on public.vanity_saves for select using (auth.uid() = user_id);
create policy "vanity_saves_insert_own" on public.vanity_saves for insert with check (auth.uid() = user_id);
create policy "vanity_saves_delete_own" on public.vanity_saves for delete using (auth.uid() = user_id);

create or replace function public.sync_vanity_saves_count()
returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then
    update public.vanity_posts set saves_count = saves_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.vanity_posts set saves_count = greatest(0, saves_count - 1) where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists vanity_saves_count_sync on public.vanity_saves;
create trigger vanity_saves_count_sync
  after insert or delete on public.vanity_saves
  for each row execute function public.sync_vanity_saves_count();
