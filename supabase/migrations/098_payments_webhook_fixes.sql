-- 098_payments_webhook_fixes.sql
-- Fix the Stripe payment webhook: it was writing through the anon/cookie
-- client, but every table it touches (profiles, club_memberships,
-- notifications) is RLS-restricted to `auth.uid() = <owner column>` — and a
-- Stripe webhook request carries no user session, so auth.uid() is null and
-- those writes were silently no-op'ing under RLS. The webhook now uses the
-- service-role client instead (see app/api/payments/stripe/webhook/route.ts).
--
-- This migration adds the pieces that were missing outright:
-- 1. `tickets` table — referenced by the webhook's event_ticket branch but
--    never migrated ("silently skips if the tickets table isn't migrated
--    yet"), so paid event tickets were never recorded at all.
-- 2. Idempotency keys so Stripe's at-least-once webhook delivery can't
--    double-record a purchase or a hanger sale on retry.

create table if not exists public.tickets (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  event_id          uuid not null,
  stripe_session_id text not null unique,
  amount_paid       integer not null default 0,
  currency          text not null default 'usd',
  status            text not null default 'confirmed',
  purchased_at      timestamptz not null default now()
);

create index if not exists tickets_user_idx  on public.tickets(user_id);
create index if not exists tickets_event_idx on public.tickets(event_id);

alter table public.tickets enable row level security;

create policy "tickets_read_own" on public.tickets
  for select using (auth.uid() = user_id);

-- Idempotency: one purchases row per Stripe checkout session.
-- (stripe_session_id already exists on purchases, added in 054_purchases.sql)
create unique index if not exists purchases_stripe_session_unique_idx
  on public.purchases (stripe_session_id)
  where stripe_session_id is not null;

-- Idempotency + linkage for hanger sales.
alter table public.hanger_sales
  add column if not exists stripe_session_id text;

create unique index if not exists hanger_sales_stripe_session_unique_idx
  on public.hanger_sales (stripe_session_id)
  where stripe_session_id is not null;
