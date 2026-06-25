-- Payment hardening: pending_orders, payment_audit_logs, tickets, gatherings price columns
-- Migration 108

-- ── Add ticket pricing columns to gatherings ──────────────────────────────────
alter table public.gatherings
  add column if not exists ticket_price_cents integer,
  add column if not exists is_free            boolean not null default true,
  add column if not exists currency           text    not null default 'usd',
  add column if not exists is_published       boolean not null default false;

-- ── Pending orders ────────────────────────────────────────────────────────────
-- Created before Stripe checkout; fulfilled by webhook on completion.
create table if not exists public.pending_orders (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  type              text        not null check (type in ('membership','ticket','club')),
  event_id          uuid        references public.gatherings(id) on delete set null,
  club_id           uuid        references public.clubs(id)      on delete set null,
  amount_cents      integer     not null,
  currency          text        not null default 'usd',
  stripe_session_id text        unique,
  status            text        not null default 'pending'
                                check (status in ('pending','paid','failed','refunded')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists pending_orders_user_idx    on public.pending_orders(user_id, created_at desc);
create index if not exists pending_orders_session_idx on public.pending_orders(stripe_session_id);
create index if not exists pending_orders_status_idx  on public.pending_orders(status, created_at desc);

alter table public.pending_orders enable row level security;

drop policy if exists "pending_orders_read_own"   on public.pending_orders;
drop policy if exists "pending_orders_admin_all"  on public.pending_orders;

create policy "pending_orders_read_own"
  on public.pending_orders for select
  using (auth.uid() = user_id);

create policy "pending_orders_admin_all"
  on public.pending_orders for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );

-- ── Tickets ───────────────────────────────────────────────────────────────────
-- Authoritative record of confirmed paid tickets. Created by webhook.
create table if not exists public.tickets (
  id                  uuid        primary key default gen_random_uuid(),
  user_id             uuid        not null references public.profiles(id) on delete cascade,
  event_id            uuid        not null references public.gatherings(id) on delete cascade,
  pending_order_id    uuid        references public.pending_orders(id) on delete set null,
  stripe_session_id   text        not null unique,
  amount_paid         integer     not null,
  currency            text        not null default 'usd',
  status              text        not null default 'confirmed'
                                  check (status in ('confirmed','refunded','cancelled')),
  purchased_at        timestamptz not null default now()
);

create index if not exists tickets_user_idx  on public.tickets(user_id, purchased_at desc);
create index if not exists tickets_event_idx on public.tickets(event_id, status);

alter table public.tickets enable row level security;

drop policy if exists "tickets_read_own"  on public.tickets;
drop policy if exists "tickets_admin_all" on public.tickets;

create policy "tickets_read_own"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "tickets_admin_all"
  on public.tickets for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );

-- ── Payment audit log ─────────────────────────────────────────────────────────
create table if not exists public.payment_audit_logs (
  id                    uuid        primary key default gen_random_uuid(),
  pending_order_id      uuid        references public.pending_orders(id) on delete set null,
  user_id               uuid        references public.profiles(id) on delete set null,
  actor_id              uuid        references public.profiles(id) on delete set null,
  event_type            text        not null,
  stripe_session_id     text,
  stripe_payment_intent text,
  amount_cents          integer,
  currency              text,
  reason                text,
  meta                  jsonb       not null default '{}'::jsonb,
  created_at            timestamptz not null default now()
);

create index if not exists payment_audit_user_idx  on public.payment_audit_logs(user_id, created_at desc);
create index if not exists payment_audit_order_idx on public.payment_audit_logs(pending_order_id, created_at desc);
create index if not exists payment_audit_type_idx  on public.payment_audit_logs(event_type, created_at desc);

alter table public.payment_audit_logs enable row level security;

drop policy if exists "payment_audit_admin_all" on public.payment_audit_logs;

create policy "payment_audit_admin_all"
  on public.payment_audit_logs for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))
  );
