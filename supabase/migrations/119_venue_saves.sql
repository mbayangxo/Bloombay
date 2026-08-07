-- "SAVE TO MY WORLD" on a venue/place detail page was local React state only
-- — it reset on every reload. Give it a real table, same shape as the
-- existing city_trending_saves.
create table if not exists public.venue_saves (
  venue_id  uuid not null references public.restaurant_partners(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  saved_at  timestamptz not null default now(),
  primary key (venue_id, user_id)
);

alter table public.venue_saves enable row level security;

drop policy if exists "venue_saves_read_own" on public.venue_saves;
create policy "venue_saves_read_own"
  on public.venue_saves for select
  using (auth.uid() = user_id);

drop policy if exists "venue_saves_add" on public.venue_saves;
create policy "venue_saves_add"
  on public.venue_saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "venue_saves_remove" on public.venue_saves;
create policy "venue_saves_remove"
  on public.venue_saves for delete
  using (auth.uid() = user_id);
