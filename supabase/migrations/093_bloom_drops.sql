-- ── Bloom Drops: limited-quantity member offers & free perks ─────────────────

CREATE TABLE bloom_drops (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  description   TEXT        NOT NULL,
  partner_name  TEXT        NOT NULL,
  partner_type  TEXT        NOT NULL DEFAULT 'cafe',
  neighborhood  TEXT,
  total_qty     INTEGER     NOT NULL DEFAULT 100,
  claimed_qty   INTEGER     NOT NULL DEFAULT 0,
  valid_until   TIMESTAMPTZ,
  is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
  cover_color_a TEXT        NOT NULL DEFAULT '#FF1F7D',
  cover_color_b TEXT        NOT NULL DEFAULT '#C4005A',
  instructions  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT claimed_qty_bounded CHECK (claimed_qty >= 0 AND claimed_qty <= total_qty)
);

CREATE TABLE drop_claims (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id     UUID        NOT NULL REFERENCES bloom_drops(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claim_code  TEXT        NOT NULL UNIQUE,
  claimed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  UNIQUE (drop_id, user_id)  -- one claim per member per drop
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_drop_claims_user   ON drop_claims (user_id);
CREATE INDEX idx_drop_claims_drop   ON drop_claims (drop_id);
CREATE INDEX idx_bloom_drops_active ON bloom_drops  (is_active, created_at DESC);

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE bloom_drops  ENABLE ROW LEVEL SECURITY;
ALTER TABLE drop_claims  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active drops visible to authenticated members"
  ON bloom_drops FOR SELECT
  USING (is_active = TRUE AND auth.uid() IS NOT NULL);

CREATE POLICY "Members can view their own claims"
  ON drop_claims FOR SELECT
  USING (user_id = auth.uid());

-- ── Atomic claim function — prevents race conditions on limited qty ────────────
CREATE OR REPLACE FUNCTION claim_bloom_drop(
  p_drop_id UUID,
  p_user_id UUID,
  p_code    TEXT
) RETURNS TEXT AS $$
DECLARE
  v_remaining INTEGER;
  v_existing  TEXT;
BEGIN
  -- Return existing claim if already done
  SELECT claim_code INTO v_existing
  FROM drop_claims
  WHERE drop_id = p_drop_id AND user_id = p_user_id;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Lock the drop row and check remaining
  SELECT total_qty - claimed_qty INTO v_remaining
  FROM bloom_drops
  WHERE id = p_drop_id AND is_active = TRUE
  FOR UPDATE;

  IF v_remaining IS NULL THEN
    RAISE EXCEPTION 'drop_not_found';
  END IF;

  IF v_remaining <= 0 THEN
    RAISE EXCEPTION 'drop_sold_out';
  END IF;

  -- Insert claim and bump counter atomically
  INSERT INTO drop_claims (drop_id, user_id, claim_code)
  VALUES (p_drop_id, p_user_id, p_code);

  UPDATE bloom_drops SET claimed_qty = claimed_qty + 1 WHERE id = p_drop_id;

  RETURN p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Seed: launch week drop — 100 free coffees ────────────────────────────────
-- Drops are weekly. One active drop at a time. One claim per member per drop.
INSERT INTO bloom_drops (
  title, description, partner_name, partner_type,
  neighborhood, total_qty, cover_color_a, cover_color_b, instructions, valid_until
) VALUES (
  'Free Coffee ☕',
  '100 coffees on us from two of our favourite neighbourhood spots. First come, first served — claim your code and show it at the counter.',
  'Café Gitane & Sant Ambroeus',
  'cafe',
  'West Village',
  100,
  '#6B3A2A',
  '#C87840',
  'Show your BB code to the barista when you order. Valid for one regular coffee or espresso drink per member. Not redeemable for cash or exchangeable.',
  NOW() + INTERVAL '7 days'
);
