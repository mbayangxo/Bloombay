-- Patch Orders — Migration 068
--
-- Tracks physical embroidered patch orders for club members.
-- Eligible: members with 3+ months continuous membership in a club.

CREATE TABLE IF NOT EXISTS public.patch_orders (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        REFERENCES public.profiles(id) ON DELETE SET NULL,
  club_id         uuid        REFERENCES public.clubs(id)    ON DELETE SET NULL,
  crest_config    jsonb       NOT NULL DEFAULT '{}',          -- snapshot of CrestConfig at time of order
  crest_svg_url   text,                                       -- stored SVG for the fulfillment partner
  status          text        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','confirmed','in_production','shipped','delivered','cancelled')),
  -- Shipping
  recipient_name  text,
  address_line1   text,
  address_line2   text,
  city            text,
  state           text,
  zip             text,
  country         text        DEFAULT 'US',
  -- Tracking
  tracking_number text,
  shipped_at      timestamptz,
  delivered_at    timestamptz,
  -- Notes
  notes           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patch_orders_user    ON public.patch_orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patch_orders_club    ON public.patch_orders(club_id, status);
CREATE INDEX IF NOT EXISTS idx_patch_orders_status  ON public.patch_orders(status, created_at DESC);

ALTER TABLE public.patch_orders ENABLE ROW LEVEL SECURITY;

-- Members can read and create their own orders
DROP POLICY IF EXISTS "patch_own_read"   ON public.patch_orders;
DROP POLICY IF EXISTS "patch_own_insert" ON public.patch_orders;

CREATE POLICY "patch_own_read"
  ON public.patch_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "patch_own_insert"
  ON public.patch_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can manage all orders
DROP POLICY IF EXISTS "patch_admin_all" ON public.patch_orders;
CREATE POLICY "patch_admin_all"
  ON public.patch_orders FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','founder'))
  );

-- Helper view: months a member has been in each club
CREATE OR REPLACE VIEW public.member_club_tenure AS
SELECT
  user_id,
  club_id,
  created_at AS joined_at,
  EXTRACT(EPOCH FROM (now() - created_at)) / (30 * 86400) AS months_in_club
FROM public.club_memberships;

COMMENT ON VIEW public.member_club_tenure IS
  'Used to check 3-month eligibility for physical patch orders.';
