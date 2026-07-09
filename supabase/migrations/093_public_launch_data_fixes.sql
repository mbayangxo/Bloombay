-- 093_public_launch_data_fixes.sql
-- Public-launch data-integrity fixes (audit 2026-06).

-- 1. notifications.type — stop silently dropping notifications.
-- `type` is a UI display-category hint, not a security/integrity boundary.
-- The restrictive CHECK repeatedly went stale (payment-confirmation, safety,
-- reservation, bloom_request, witness, etc. inserts were rejected and the
-- notification silently never landed). Removing the CHECK fixes that whole
-- bug class going forward. Keep `type text not null` for basic sanity.
ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_type_check;

-- 2. clubs.is_active / clubs.member_count — columns the app already queries.
-- The public clubs directory does `.eq("is_active", true).order("member_count")`
-- and several other surfaces select member_count; without these columns the
-- query errors and the directory renders empty. Add them and backfill counts
-- from the real membership table.
ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

ALTER TABLE public.clubs
  ADD COLUMN IF NOT EXISTS member_count integer NOT NULL DEFAULT 0;

-- Backfill member_count from club_memberships (keyed by slug).
UPDATE public.clubs c
SET member_count = COALESCE((
  SELECT count(*) FROM public.club_memberships m WHERE m.club_slug = c.slug
), 0);

CREATE INDEX IF NOT EXISTS clubs_is_active_idx ON public.clubs (is_active);
