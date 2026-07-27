-- 103_tickets_schema_reconcile.sql
-- Two independent migrations both created public.tickets via
-- `create table if not exists`: 098_payments_webhook_fixes.sql (a narrower
-- schema, no platform_fee_cents/host_receives_cents) and
-- 102_stripe_connect_analytics.sql (adds those two columns for Stripe
-- Connect payouts). Whichever runs first wins the actual table shape —
-- 098 always runs before 102 by filename order — so
-- 102's `create table if not exists` becomes a silent no-op and its two
-- extra columns never get created.
--
-- The webhook (app/api/payments/stripe/webhook/route.ts, event_ticket
-- branch) writes platform_fee_cents and host_receives_cents on every paid
-- ticket purchase. Without this reconciliation, that upsert 500s in
-- production with "column does not exist" and no paid ticket ever gets
-- recorded — the same class of bug as the earlier Hanger webhook fix,
-- just introduced by two migrations racing to create the same table.
-- alter table ... add column if not exists is idempotent regardless of
-- which of the two migrations happened to create the table first.

alter table public.tickets
  add column if not exists platform_fee_cents integer not null default 0;

alter table public.tickets
  add column if not exists host_receives_cents integer not null default 0;
