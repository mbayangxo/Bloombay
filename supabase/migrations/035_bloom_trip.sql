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

create trigger bloom_trip_count_sync
  after insert or delete on public.bloom_trip_attendees
  for each row execute function public.sync_trip_count();

alter table public.bloom_trips          enable row level security;
alter table public.bloom_trip_attendees enable row level security;

create policy "trips_read_open"       on public.bloom_trips          for select using (status in ('open','full') or auth.uid() = organizer_id);
create policy "trips_write_own"       on public.bloom_trips          for insert with check (auth.uid() = organizer_id);
create policy "trips_update_own"      on public.bloom_trips          for update using  (auth.uid() = organizer_id);
create policy "attendees_read_all"    on public.bloom_trip_attendees for select using (true);
create policy "attendees_join"        on public.bloom_trip_attendees for insert with check (auth.uid() = user_id);
create policy "attendees_leave"       on public.bloom_trip_attendees for delete using  (auth.uid() = user_id);

create index if not exists trips_departure_idx on public.bloom_trips(departure_date asc);
create index if not exists trips_organizer_idx on public.bloom_trips(organizer_id);
