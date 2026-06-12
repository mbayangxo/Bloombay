-- Event extras: waitlist, post-event witnesses, host reviews

-- Waitlist: women who want in when an event is full
create table if not exists public.event_waitlist (
  id         uuid primary key default gen_random_uuid(),
  event_id   text not null,   -- uuid stored as text: compatible with both gatherings + events
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

-- Post-event witnesses: after an event, tag who you met
create table if not exists public.event_witnesses (
  id           uuid primary key default gen_random_uuid(),
  event_id     text not null,
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id   uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),
  unique (event_id, from_user_id, to_user_id),
  check (from_user_id <> to_user_id)
);

-- Host reviews: women rate a host after attending
create table if not exists public.host_reviews (
  id          uuid primary key default gen_random_uuid(),
  event_id    text not null,
  host_id     uuid not null references public.profiles(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  content     text,
  created_at  timestamptz not null default now(),
  unique (event_id, reviewer_id)
);

-- RLS
alter table public.event_waitlist  enable row level security;
alter table public.event_witnesses enable row level security;
alter table public.host_reviews    enable row level security;

create policy "waitlist_read_all"   on public.event_waitlist  for select using (true);
create policy "waitlist_join"       on public.event_waitlist  for insert with check (auth.uid() = user_id);
create policy "waitlist_leave"      on public.event_waitlist  for delete using  (auth.uid() = user_id);

create policy "witnesses_read_all"  on public.event_witnesses for select using (true);
create policy "witnesses_write_own" on public.event_witnesses for insert with check (auth.uid() = from_user_id);
create policy "witnesses_delete_own" on public.event_witnesses for delete using (auth.uid() = from_user_id);

create policy "reviews_read_all"   on public.host_reviews for select using (true);
create policy "reviews_write_own"  on public.host_reviews for insert with check (auth.uid() = reviewer_id);
create policy "reviews_delete_own" on public.host_reviews for delete using  (auth.uid() = reviewer_id);

-- Notify host when they receive a review
create or replace function public.notify_host_review()
returns trigger language plpgsql security definer as $$
begin
  if new.host_id <> new.reviewer_id then
    perform public.create_notification(
      new.host_id,
      'host_review',
      'Someone reviewed you as a host',
      'A woman rated her experience at your event.',
      '/member/profile',
      jsonb_build_object('event_id', new.event_id, 'rating', new.rating)
    );
  end if;
  return new;
end;
$$;

create trigger host_review_notify
  after insert on public.host_reviews
  for each row execute function public.notify_host_review();

-- Notify user when someone witnesses them
create or replace function public.notify_witness()
returns trigger language plpgsql security definer as $$
begin
  perform public.create_notification(
    new.to_user_id,
    'witness',
    'Someone witnessed you',
    'A woman tagged you at a recent event.',
    '/member/happenings',
    jsonb_build_object('event_id', new.event_id, 'from_user_id', new.from_user_id)
  );
  return new;
end;
$$;

create trigger witness_notify
  after insert on public.event_witnesses
  for each row execute function public.notify_witness();

-- Indexes
create index if not exists waitlist_event_idx    on public.event_waitlist(event_id, created_at);
create index if not exists waitlist_user_idx     on public.event_waitlist(user_id);
create index if not exists witnesses_event_idx   on public.event_witnesses(event_id);
create index if not exists witnesses_to_user_idx on public.event_witnesses(to_user_id);
create index if not exists reviews_host_idx      on public.host_reviews(host_id, created_at desc);
create index if not exists reviews_event_idx     on public.host_reviews(event_id);
