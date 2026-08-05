-- Fixes for Supabase Security Advisor CRITICAL findings.
--
-- 1) Security Definer Views: by default a view runs with the privileges of
--    its OWNER, not the querying user — so it silently bypasses RLS on the
--    tables it selects from. Several views here were exposing every user's
--    data (Hanger earnings/balances, private lifestyle preferences) to any
--    authenticated caller. Fixed with `security_invoker = true`, which makes
--    the view enforce the CALLER's own RLS instead.
-- 2) RLS disabled: yande_compat_weights had no RLS at all.
-- 3) Function Search Path Mutable: SECURITY DEFINER functions without a
--    pinned search_path are vulnerable to search_path hijacking (a caller
--    could shadow an unqualified object the function references). Pinned
--    search_path = public on every one that was missing it.

-- ── 1a) hanger_earnings needs a real RLS path for sellers ──────────────────
-- The view shows sellers their OWN earnings from hanger_purchase rows in
-- `purchases`, but the only existing purchases policy lets the BUYER read
-- their own row, not the seller. Add that, then lock the view to the
-- caller's own RLS instead of bypassing it.
drop policy if exists "sellers_read_own_hanger_sales" on public.purchases;
create policy "sellers_read_own_hanger_sales"
  on public.purchases for select
  using (
    type = 'hanger_purchase'
    and exists (
      select 1 from public.hanger_listings hl
      where hl.id = purchases.item_id::uuid
        and hl.seller_id = auth.uid()
    )
  );

alter view public.hanger_earnings set (security_invoker = true);

-- ── 1b) hanger_seller_balance — sales RLS already covers seller + buyer ────
alter view public.hanger_seller_balance set (security_invoker = true);

-- ── 1c) hanger_listing_appreciation — hanger_flowers is fully public-read ──
alter view public.hanger_listing_appreciation set (security_invoker = true);

-- ── 1d) member_club_tenure — club_memberships is fully public-read ─────────
alter view public.member_club_tenure set (security_invoker = true);

-- ── 1e) member_lifestyle_tags — member_preferences RLS covers own + admin ──
alter view public.member_lifestyle_tags set (security_invoker = true);

-- ── 1f) hanger_seller_stats — was querying auth.users directly (which is
-- why it had to bypass RLS in the first place, since regular roles can't
-- read auth.users at all). Rewritten against public.profiles, which every
-- authenticated member can already read, so the view no longer needs to
-- touch auth.users or bypass anything.
create or replace view public.hanger_seller_stats
with (security_invoker = true)
as
select
  p.id as seller_id,
  coalesce(r.review_count, 0) as review_count,
  coalesce(r.avg_rating, 0)   as avg_rating,
  coalesce(f.flower_count, 0) as flower_count
from public.profiles p
left join (
  select seller_id, count(*) as review_count, round(avg(rating)::numeric, 1) as avg_rating
  from public.hanger_reviews
  group by seller_id
) r on r.seller_id = p.id
left join (
  select recipient_id, count(*) as flower_count
  from public.hanger_flowers
  group by recipient_id
) f on f.recipient_id = p.id;

grant select on public.hanger_seller_stats to authenticated;

-- ── 2) yande_compat_weights had no RLS at all ───────────────────────────────
-- Algorithm weights, not user data — safe to read, but only the cron
-- (service role, which bypasses RLS) should ever write to it.
alter table public.yande_compat_weights enable row level security;

drop policy if exists "yande_compat_weights_read" on public.yande_compat_weights;
create policy "yande_compat_weights_read"
  on public.yande_compat_weights for select
  to authenticated
  using (true);

-- ── 3) Pin search_path on SECURITY DEFINER functions missing it ────────────
alter function public.create_notification(uuid, text, text, text, text, jsonb) set search_path = public;
alter function public.notify_bloom_note_flower() set search_path = public;
alter function public.sync_tradition_follower_count() set search_path = public;
alter function public.increment_wall_bloom() set search_path = public;
alter function public.decrement_wall_bloom() set search_path = public;
alter function public.notify_host_review() set search_path = public;
alter function public.notify_witness() set search_path = public;
alter function public.sync_wellness_saves_count() set search_path = public;
alter function public.notify_profile_flower() set search_path = public;
alter function public.sync_vanity_saves_count() set search_path = public;
alter function public.increment_intro_flower() set search_path = public;
alter function public.decrement_intro_flower() set search_path = public;
alter function public.notify_member_invitation() set search_path = public;
