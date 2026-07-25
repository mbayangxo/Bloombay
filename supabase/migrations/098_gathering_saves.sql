-- Happening saves: members bookmark gatherings into My gems (alongside City spots)

alter table public.gatherings
  add column if not exists save_count integer not null default 0;

create table if not exists public.gathering_saves (
  gathering_id uuid not null references public.gatherings(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  saved_at     timestamptz not null default now(),
  primary key (gathering_id, user_id)
);

create index if not exists gathering_saves_user_idx
  on public.gathering_saves (user_id, saved_at desc);

alter table public.gathering_saves enable row level security;

drop policy if exists "gathering_saves_read_own" on public.gathering_saves;
create policy "gathering_saves_read_own"
  on public.gathering_saves for select
  using (auth.uid() = user_id);

drop policy if exists "gathering_saves_add" on public.gathering_saves;
create policy "gathering_saves_add"
  on public.gathering_saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "gathering_saves_remove" on public.gathering_saves;
create policy "gathering_saves_remove"
  on public.gathering_saves for delete
  using (auth.uid() = user_id);

create or replace function public.inc_gathering_saves()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.gatherings set save_count = save_count + 1 where id = NEW.gathering_id;
  elsif TG_OP = 'DELETE' then
    update public.gatherings set save_count = greatest(0, save_count - 1) where id = OLD.gathering_id;
  end if;
  return null;
end;
$$;

drop trigger if exists gathering_saves_count on public.gathering_saves;
create trigger gathering_saves_count
  after insert or delete on public.gathering_saves
  for each row execute function public.inc_gathering_saves();

comment on table public.gathering_saves is
  'Member bookmarks for Happenings gatherings — shown in My gems';
