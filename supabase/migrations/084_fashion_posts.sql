-- Fashion posts: user-created template posts for Avenue (closet) and Hanger
-- Supports all 5 FashionPostSheet template types with photo arrays and captions

create table if not exists public.fashion_posts (
  id            uuid        primary key default gen_random_uuid(),
  author_id     uuid        not null references public.profiles(id) on delete cascade,
  context       text        not null default 'avenue'
                check (context in ('avenue', 'hanger')),
  category      text        not null default 'fits',
  template_id   text        not null default 'standard'
                check (template_id in ('standard', 'polaroid_single', 'polaroid_grid', 'collage', 'editorial')),
  title         text,
  caption       text,
  photo_urls    text[]      not null default '{}',
  photo_captions text[]     not null default '{}',
  border_color  text,
  blooms        integer     not null default 0,
  meta          jsonb,
  status        text        not null default 'published'
                check (status in ('published', 'removed')),
  created_at    timestamptz not null default now()
);

create index if not exists fashion_posts_author_idx  on public.fashion_posts(author_id, created_at desc);
create index if not exists fashion_posts_context_idx on public.fashion_posts(context, created_at desc);

alter table public.fashion_posts enable row level security;

drop policy if exists "fashion_posts_read" on public.fashion_posts;
create policy "fashion_posts_read"
  on public.fashion_posts for select
  using (status = 'published');

drop policy if exists "fashion_posts_insert_own" on public.fashion_posts;
create policy "fashion_posts_insert_own"
  on public.fashion_posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "fashion_posts_delete_own" on public.fashion_posts;
create policy "fashion_posts_delete_own"
  on public.fashion_posts for delete
  using (auth.uid() = author_id);
