-- ── Drops redemption portal: claim details + partner view ─────────────────────

-- Full claim detail for a code (partner verification + member code screen)
CREATE OR REPLACE FUNCTION get_claim_details(p_code TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'code',          dc.claim_code,
    'claimed_at',    dc.claimed_at,
    'redeemed_at',   dc.redeemed_at,
    'drop_id',       bd.id,
    'drop_title',    bd.title,
    'drop_category', bd.category,
    'partner_name',  bd.partner_name,
    'neighborhood',  bd.neighborhood,
    'valid_until',   bd.valid_until,
    'instructions',  bd.instructions,
    'cover_color_a', bd.cover_color_a,
    'cover_color_b', bd.cover_color_b,
    'member_name',   COALESCE(
                       split_part(NULLIF(TRIM(p.full_name),''), ' ', 1),
                       split_part(au.email, '@', 1)
                     ),
    'status', CASE
      WHEN dc.redeemed_at IS NOT NULL                              THEN 'redeemed'
      WHEN bd.valid_until IS NOT NULL AND bd.valid_until < NOW()   THEN 'expired'
      ELSE 'active'
    END
  )
  INTO v_result
  FROM drop_claims dc
  JOIN bloom_drops bd  ON bd.id  = dc.drop_id
  JOIN auth.users  au  ON au.id  = dc.user_id
  LEFT JOIN profiles p ON p.id   = dc.user_id
  WHERE dc.claim_code = p_code;

  RETURN COALESCE(v_result, jsonb_build_object('error', 'not_found'));
END;
$$;

-- All claims across all active drops (partner admin view, ordered newest first)
-- Returns up to 500 most recent claims.
CREATE OR REPLACE FUNCTION get_all_drop_claims()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(jsonb_agg(row ORDER BY row->>'claimed_at' DESC), '[]'::jsonb)
    FROM (
      SELECT jsonb_build_object(
        'claim_id',    dc.id,
        'code',        dc.claim_code,
        'claimed_at',  dc.claimed_at,
        'redeemed_at', dc.redeemed_at,
        'drop_title',  bd.title,
        'drop_id',     bd.id,
        'partner_name',bd.partner_name,
        'valid_until', bd.valid_until,
        'member_name', COALESCE(
                         split_part(NULLIF(TRIM(p.full_name),''), ' ', 1),
                         split_part(au.email, '@', 1)
                       ),
        'status', CASE
          WHEN dc.redeemed_at IS NOT NULL                             THEN 'redeemed'
          WHEN bd.valid_until IS NOT NULL AND bd.valid_until < NOW()  THEN 'expired'
          ELSE 'active'
        END
      ) AS row
      FROM drop_claims dc
      JOIN bloom_drops bd  ON bd.id  = dc.drop_id
      JOIN auth.users  au  ON au.id  = dc.user_id
      LEFT JOIN profiles p ON p.id   = dc.user_id
      ORDER BY dc.claimed_at DESC
      LIMIT 500
    ) sub
  );
END;
$$;
