-- Flowers: the Bloombay reaction system (instead of likes).
-- Members give flowers to events, profiles, and clubs.

-- Event flowers (give a flower to a gathering/happening)
create table if not exists public.gathering_flowers (
  gathering_id  uuid not null references public.gatherings(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (gathering_id, user_id)
);

alter table public.gathering_flowers enable row level security;

create policy "gathering_flowers_read_all"
  on public.gathering_flowers for select using (true);

create policy "gathering_flowers_give_own"
  on public.gathering_flowers for insert with check (auth.uid() = user_id);

create policy "gathering_flowers_take_back_own"
  on public.gathering_flowers for delete using (auth.uid() = user_id);

-- Profile flowers (give a flower to a member's profile — e.g. after witnessing her at an event)
create table if not exists public.profile_flowers (
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  flower_type text not null default 'general' check (flower_type in ('general','witness','host','club')),
  message     text,
  created_at  timestamptz not null default now(),
  primary key (profile_id, user_id, flower_type)
);

alter table public.profile_flowers enable row level security;

create policy "profile_flowers_read_all"
  on public.profile_flowers for select using (true);

create policy "profile_flowers_give_own"
  on public.profile_flowers for insert with check (auth.uid() = user_id);

create policy "profile_flowers_take_back_own"
  on public.profile_flowers for delete using (auth.uid() = user_id);

-- Notify the recipient when they receive a profile flower
create or replace function public.notify_profile_flower()
returns trigger language plpgsql security definer as $$
begin
  if new.profile_id <> new.user_id then
    perform public.create_notification(
      new.profile_id,
      'flower',
      'Someone sent you flowers 🌸',
      coalesce(new.message, 'A Bloomie sent you flowers.'),
      '/member/lounge',
      jsonb_build_object('from_user_id', new.user_id, 'flower_type', new.flower_type)
    );
  end if;
  return new;
end;
$$;

create trigger profile_flower_notify
  after insert on public.profile_flowers
  for each row execute function public.notify_profile_flower();

-- Indexes
create index if not exists gathering_flowers_gathering_idx on public.gathering_flowers(gathering_id);
create index if not exists gathering_flowers_user_idx     on public.gathering_flowers(user_id);
create index if not exists profile_flowers_profile_idx   on public.profile_flowers(profile_id, created_at desc);
create index if not exists profile_flowers_user_idx      on public.profile_flowers(user_id, created_at desc);
