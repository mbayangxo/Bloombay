-- Personal board on the Apartment page: pin text, links, or photos to your own
-- profile. Distinct from Bloom Notes (place/gathering reviews) and the
-- Avenue's communal Wall — this one belongs to a single member.
create table if not exists public.board_posts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null default 'text' check (kind in ('text', 'link', 'photo', 'voice')),
  body       text,
  link_url   text,
  image_url  text,
  voice_url  text,
  created_at timestamptz not null default now()
);

create index if not exists board_posts_user_idx on public.board_posts(user_id, created_at desc);

alter table public.board_posts enable row level security;

create policy "board_posts_read_all"
  on public.board_posts for select using (true);

create policy "board_posts_write_own"
  on public.board_posts for insert with check (auth.uid() = user_id);

create policy "board_posts_delete_own"
  on public.board_posts for delete using (auth.uid() = user_id);
