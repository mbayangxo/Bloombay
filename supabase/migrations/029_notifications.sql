-- App notifications

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null
    check (type in ('flower','seat','event','message','club','club_accepted','intro','celebrate','club_new_post','gathering')),
  title       text not null,
  body        text,
  link        text,         -- internal path to navigate to on tap
  data        jsonb,        -- arbitrary extra payload (club name, crest, etc.)
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifs_read_own"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifs_insert_service"
  on public.notifications for insert
  with check (auth.uid() = user_id);

create policy "notifs_update_own"
  on public.notifications for update
  using (auth.uid() = user_id);

create index if not exists notifs_user_idx on public.notifications(user_id, created_at desc);

-- Helper called from triggers / server actions to fan-out notifications
create or replace function public.create_notification(
  p_user_id uuid,
  p_type    text,
  p_title   text,
  p_body    text    default null,
  p_link    text    default null,
  p_data    jsonb   default null
) returns void language plpgsql security definer as $$
begin
  insert into public.notifications(user_id, type, title, body, link, data)
  values (p_user_id, p_type, p_title, p_body, p_link, p_data);
end;
$$;
