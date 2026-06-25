-- Notifications architecture — Migration 113
-- Centralised notification_events log + user preferences table.

-- ── NOTIFICATION_EVENTS ───────────────────────────────────────────────────────
-- Every notification attempt is recorded here, regardless of channel/outcome.
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

create index if not exists notif_events_user_idx
  on public.notification_events(user_id, created_at desc);

create index if not exists notif_events_type_idx
  on public.notification_events(type, created_at desc);

create index if not exists notif_events_status_idx
  on public.notification_events(status, created_at desc)
  where status in ('pending', 'failed');

alter table public.notification_events enable row level security;

-- Users can read their own notification history; admins can read all (service role)
create policy "Notification events user read"
  on public.notification_events for select
  using (auth.uid() = user_id);

-- ── NOTIFICATION_PREFERENCES ─────────────────────────────────────────────────
-- Per-user channel and topic preferences.
create table if not exists public.notification_preferences (
  user_id           uuid    primary key references public.profiles(id) on delete cascade,
  email_enabled     boolean not null default true,
  in_app_enabled    boolean not null default true,
  sms_enabled       boolean not null default false,  -- opt-in, off by default
  event_reminders   boolean not null default true,
  club_updates      boolean not null default true,
  girlmate_messages boolean not null default true,
  bloom_requests    boolean not null default true,
  updated_at        timestamptz not null default now()
);

alter table public.notification_preferences enable row level security;

create policy "Notification prefs user read"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Notification prefs user update"
  on public.notification_preferences for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notification prefs user insert"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

-- Automatically create default preferences when a profile is inserted
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
