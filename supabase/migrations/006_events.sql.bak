-- ── EVENTS ───────────────────────────────────────────────────────
create table if not exists public.events (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  created_by      uuid references public.profiles(id) on delete set null,

  -- content
  title           text not null,
  description     text,
  venue           text,
  neighborhood    text,
  city            text not null default 'NYC',
  date_time       timestamptz not null,
  end_time        timestamptz,

  -- visuals
  photo_url       text,
  accent_color    text default '#FF1F7D',
  host_note       text,

  -- categorization
  category        text check (category in ('dinner','party','brunch','wellness','culture','social','rooftop','walk','art','sports')),
  badge           text,   -- 'TONIGHT' | 'THIS WEEKEND' | 'TRENDING' | null

  -- capacity
  capacity        integer,
  attending_count integer not null default 0,

  -- pricing
  price_cents     integer not null default 0,

  -- flags
  is_official     boolean not null default false,
  is_published    boolean not null default true
);

-- ── RLS ──────────────────────────────────────────────────────────
alter table public.events enable row level security;

create policy "events_read_published"
  on public.events for select
  using (is_published = true);

create policy "events_insert_admin"
  on public.events for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin','founder','curator')
    )
  );

create policy "events_update_admin"
  on public.events for update
  using (
    created_by = auth.uid() or
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin','founder','curator')
    )
  );

-- ── EVENT ATTENDEES ───────────────────────────────────────────────
create table if not exists public.event_attendees (
  event_id    uuid not null references public.events(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  joined_at   timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.event_attendees enable row level security;
create policy "event_attendees_read_all" on public.event_attendees for select using (true);
create policy "event_attendees_join"     on public.event_attendees for insert with check (auth.uid() = user_id);
create policy "event_attendees_leave"    on public.event_attendees for delete using (auth.uid() = user_id);

-- keep attending_count in sync
create or replace function public.sync_event_count()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update public.events set attending_count = attending_count + 1 where id = new.event_id;
  elsif tg_op = 'DELETE' then
    update public.events set attending_count = greatest(0, attending_count - 1) where id = old.event_id;
  end if;
  return null;
end;
$$;

drop trigger if exists event_attendees_count on public.event_attendees;
create trigger event_attendees_count
  after insert or delete on public.event_attendees
  for each row execute function public.sync_event_count();

-- ── STORAGE BUCKET ────────────────────────────────────────────────
-- Create in Supabase dashboard → Storage:
--   Bucket name: event-photos  (public: true)
-- Storage RLS policy:
--   Allow admin/founder/curator to upload:
--   (bucket_id = 'event-photos')
