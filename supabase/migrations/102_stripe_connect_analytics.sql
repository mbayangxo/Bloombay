-- End-to-end: Stripe Connect payouts, host flags, event analytics, tickets ledger

-- ── Host + payout destinations ───────────────────────────────────────────────
alter table public.profiles
  add column if not exists is_host boolean not null default false;

alter table public.profiles
  add column if not exists stripe_account_id text;

alter table public.profiles
  add column if not exists stripe_charges_enabled boolean not null default false;

alter table public.profiles
  add column if not exists stripe_payouts_enabled boolean not null default false;

alter table public.profiles
  add column if not exists stripe_details_submitted boolean not null default false;

alter table public.clubs
  add column if not exists stripe_account_id text;

alter table public.clubs
  add column if not exists stripe_charges_enabled boolean not null default false;

alter table public.clubs
  add column if not exists stripe_payouts_enabled boolean not null default false;

alter table public.clubs
  add column if not exists stripe_details_submitted boolean not null default false;

-- Mark existing hosts
update public.profiles p
set is_host = true
where exists (select 1 from public.gatherings g where g.host_id = p.id);

-- ── Tickets (paid happening seats) ───────────────────────────────────────────
create table if not exists public.tickets (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  event_id            uuid not null references public.gatherings(id) on delete cascade,
  stripe_session_id   text unique,
  stripe_payment_intent text,
  amount_paid         integer not null default 0,
  platform_fee_cents  integer not null default 0,
  host_receives_cents integer not null default 0,
  currency            text not null default 'gbp',
  status              text not null default 'confirmed'
    check (status in ('pending', 'confirmed', 'refunded', 'cancelled')),
  purchased_at        timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists tickets_event_idx on public.tickets(event_id);
create index if not exists tickets_user_idx on public.tickets(user_id);
create unique index if not exists tickets_user_event_unique
  on public.tickets(user_id, event_id)
  where status = 'confirmed';

alter table public.tickets enable row level security;

drop policy if exists "tickets_read_own" on public.tickets;
create policy "tickets_read_own" on public.tickets
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.gatherings g
      where g.id = event_id and g.host_id = auth.uid()
    )
  );

-- ── Gathering analytics ──────────────────────────────────────────────────────
create table if not exists public.gathering_analytics_events (
  id            uuid primary key default gen_random_uuid(),
  gathering_id  uuid not null references public.gatherings(id) on delete cascade,
  user_id       uuid references public.profiles(id) on delete set null,
  event_type    text not null check (event_type in ('view', 'click', 'interest', 'share')),
  created_at    timestamptz not null default now()
);

create index if not exists gathering_analytics_gathering_idx
  on public.gathering_analytics_events(gathering_id, event_type);

create index if not exists gathering_analytics_created_idx
  on public.gathering_analytics_events(created_at desc);

alter table public.gathering_analytics_events enable row level security;

drop policy if exists "gathering_analytics_insert_auth" on public.gathering_analytics_events;
create policy "gathering_analytics_insert_auth"
  on public.gathering_analytics_events for insert
  with check (auth.uid() is not null);

drop policy if exists "gathering_analytics_read_host" on public.gathering_analytics_events;
create policy "gathering_analytics_read_host"
  on public.gathering_analytics_events for select
  using (
    exists (
      select 1 from public.gatherings g
      where g.id = gathering_id and g.host_id = auth.uid()
    )
  );

-- Purchases: track host destination
alter table public.purchases
  add column if not exists host_id uuid references public.profiles(id) on delete set null;

alter table public.purchases
  add column if not exists stripe_destination_account text;

alter table public.purchases
  add column if not exists platform_fee_cents integer not null default 0;
