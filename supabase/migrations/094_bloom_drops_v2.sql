-- ── Bloom Drops v2: categories, badge text, featured flag, redemption ─────────

ALTER TABLE bloom_drops
  ADD COLUMN IF NOT EXISTS category   TEXT NOT NULL DEFAULT 'food_drink'
    CONSTRAINT bloom_drops_category_check
    CHECK (category IN ('food_drink','beauty_wellness','experiences','shopping','travel')),
  ADD COLUMN IF NOT EXISTS badge_text TEXT,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_bloom_drops_category ON bloom_drops (category, is_active);

-- Backfill existing seed drop
UPDATE bloom_drops
SET category = 'food_drink', badge_text = 'JUST FOR US', is_featured = TRUE
WHERE partner_name = 'Café Gitane & Sant Ambroeus';

-- ── Partner redemption function ───────────────────────────────────────────────
-- Partners call POST /api/drops/redeem { code } which calls this.
-- Returns JSON: { ok: true } | { error: 'code_not_found'|'already_redeemed'|'expired' }
CREATE OR REPLACE FUNCTION redeem_drop_code(p_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_claim_id  UUID;
  v_redeemed  TIMESTAMPTZ;
  v_valid     TIMESTAMPTZ;
  v_title     TEXT;
BEGIN
  SELECT dc.id, dc.redeemed_at, bd.valid_until, bd.title
  INTO v_claim_id, v_redeemed, v_valid, v_title
  FROM drop_claims dc
  JOIN bloom_drops bd ON bd.id = dc.drop_id
  WHERE dc.claim_code = p_code;

  IF v_claim_id IS NULL THEN
    RETURN jsonb_build_object('error', 'code_not_found');
  END IF;

  IF v_redeemed IS NOT NULL THEN
    RETURN jsonb_build_object('error', 'already_redeemed', 'redeemed_at', v_redeemed);
  END IF;

  IF v_valid IS NOT NULL AND v_valid < NOW() THEN
    RETURN jsonb_build_object('error', 'expired');
  END IF;

  UPDATE drop_claims SET redeemed_at = NOW() WHERE id = v_claim_id;

  RETURN jsonb_build_object('ok', TRUE, 'drop_title', v_title);
END;
$$;

-- Partner-facing redemption RLS note:
-- This function runs as SECURITY DEFINER so any authenticated user can call it.
-- In production, restrict to partner role by checking auth.jwt() claims.
