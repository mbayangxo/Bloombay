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

create policy "book_read_active"  on public.book_listings  for select using (is_active = true or auth.uid() = provider_id);
create policy "book_write_own"    on public.book_listings  for insert with check (auth.uid() = provider_id);
create policy "book_update_own"   on public.book_listings  for update using  (auth.uid() = provider_id);
create policy "request_read_own"  on public.book_requests  for select using  (auth.uid() = client_id or auth.uid() = (select provider_id from public.book_listings where id = listing_id));
create policy "request_write_own" on public.book_requests  for insert with check (auth.uid() = client_id);

create index if not exists book_category_idx  on public.book_listings(category, is_active);
create index if not exists book_provider_idx  on public.book_listings(provider_id);
