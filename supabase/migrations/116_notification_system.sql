-- Notification system hardening — Migration 116
-- Supplements 113_notifications_architecture.sql with indexes and service policies.

-- Ensure tables exist (idempotent with 113)
create table if not exists public.notification_events (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  type          text        not null,
  channel       text        not null
    check (channel in ('in_app', 'email', 'sms')),
  payload       jsonb       not null default '{}'::jsonb,
  status        text        not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  error_message text,
  created_at    timestamptz not null default now(),
  sent_at       timestamptz
);

create table if not exists public.notification_preferences (
  user_id           uuid    primary key references public.profiles(id) on delete cascade,
  email_enabled     boolean not null default true,
  in_app_enabled    boolean not null default true,
  sms_enabled       boolean not null default false,
  event_reminders   boolean not null default true,
  club_updates      boolean not null default true,
  girlmate_messages boolean not null default true,
  bloom_requests    boolean not null default true,
  updated_at        timestamptz not null default now()
);

-- Indexes per architecture spec
create index if not exists notif_events_user_id_idx
  on public.notification_events(user_id);

create index if not exists notif_events_status_idx_v2
  on public.notification_events(status);

create index if not exists notif_events_created_at_idx
  on public.notification_events(created_at desc);

create index if not exists notif_events_type_created_idx
  on public.notification_events(type, created_at desc);

-- RLS (idempotent)
alter table public.notification_events enable row level security;
alter table public.notification_preferences enable row level security;

drop policy if exists "Notification events user read" on public.notification_events;
create policy "Notification events user read"
  on public.notification_events for select
  using (auth.uid() = user_id);

drop policy if exists "Notification prefs user read" on public.notification_preferences;
create policy "Notification prefs user read"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Notification prefs user update" on public.notification_preferences;
create policy "Notification prefs user update"
  on public.notification_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Notification prefs user insert" on public.notification_preferences;
create policy "Notification prefs user insert"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

-- Default prefs trigger (idempotent)
create or replace function public.create_default_notification_prefs()
returns trigger language plpgsql security definer as $$
begin
  insert into public.notification_preferences(user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_notification_prefs on public.profiles;
create trigger on_profile_created_notification_prefs
  after insert on public.profiles
  for each row execute function public.create_default_notification_prefs();
