-- Flower gifts: one flower (1) or a bouquet (12).
-- Received totals convert: every 12 flower-units display as 1 bouquet.

-- gathering_flowers
alter table public.gathering_flowers
  add column if not exists gift_kind text not null default 'flower'
    check (gift_kind in ('flower', 'bouquet'));

alter table public.gathering_flowers
  add column if not exists units int not null default 1;

update public.gathering_flowers
set units = case when gift_kind = 'bouquet' then 12 else 1 end
where units is distinct from case when gift_kind = 'bouquet' then 12 else 1 end;

-- bloom_note_flowers
alter table public.bloom_note_flowers
  add column if not exists gift_kind text not null default 'flower'
    check (gift_kind in ('flower', 'bouquet'));

alter table public.bloom_note_flowers
  add column if not exists units int not null default 1;

update public.bloom_note_flowers
set units = case when gift_kind = 'bouquet' then 12 else 1 end
where units is distinct from case when gift_kind = 'bouquet' then 12 else 1 end;

-- profile_flowers already has flower_type for context; add gift size
alter table public.profile_flowers
  add column if not exists gift_kind text not null default 'flower'
    check (gift_kind in ('flower', 'bouquet'));

alter table public.profile_flowers
  add column if not exists units int not null default 1;

update public.profile_flowers
set units = case when gift_kind = 'bouquet' then 12 else 1 end
where units is distinct from case when gift_kind = 'bouquet' then 12 else 1 end;

-- Places (City partners / venues)
create table if not exists public.place_flowers (
  place_slug  text not null,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  gift_kind   text not null default 'flower' check (gift_kind in ('flower', 'bouquet')),
  units       int not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (place_slug, user_id)
);

alter table public.place_flowers enable row level security;

drop policy if exists "place_flowers_read_all" on public.place_flowers;
create policy "place_flowers_read_all"
  on public.place_flowers for select using (true);

drop policy if exists "place_flowers_give_own" on public.place_flowers;
create policy "place_flowers_give_own"
  on public.place_flowers for insert with check (auth.uid() = user_id);

drop policy if exists "place_flowers_update_own" on public.place_flowers;
create policy "place_flowers_update_own"
  on public.place_flowers for update using (auth.uid() = user_id);

drop policy if exists "place_flowers_take_back_own" on public.place_flowers;
create policy "place_flowers_take_back_own"
  on public.place_flowers for delete using (auth.uid() = user_id);

create index if not exists place_flowers_slug_idx on public.place_flowers(place_slug);

-- Allow upgrading flower → bouquet on gatherings / notes
drop policy if exists "gathering_flowers_update_own" on public.gathering_flowers;
create policy "gathering_flowers_update_own"
  on public.gathering_flowers for update using (auth.uid() = user_id);

drop policy if exists "bloom_note_flowers_update_own" on public.bloom_note_flowers;
create policy "bloom_note_flowers_update_own"
  on public.bloom_note_flowers for update using (auth.uid() = user_id);

drop policy if exists "profile_flowers_update_own" on public.profile_flowers;
create policy "profile_flowers_update_own"
  on public.profile_flowers for update using (auth.uid() = user_id);
