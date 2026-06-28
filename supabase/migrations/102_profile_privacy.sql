-- Profile privacy hardening (schema-tolerant)
-- Safe on early profiles schema (002): id, full_name, city, neighborhood, role, created_at

-- ── Profiles RLS ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_read_all" ON public.profiles;
DROP POLICY IF EXISTS "public_profiles_read" ON public.profiles;
DROP POLICY IF EXISTS "Profiles read own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_admin" ON public.profiles;

CREATE POLICY "profiles_read_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_read_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role::text IN ('admin', 'founder')
    )
  );

-- ── Safe public profiles view (minimal columns) ─────────────────────────────
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
  SELECT
    p.id,
    p.full_name,
    p.role,
    p.created_at
  FROM public.profiles p
  WHERE p.role::text = 'member';

GRANT SELECT ON public.public_profiles TO authenticated;

-- ── Club membership privacy (only if club_memberships + clubs exist) ──────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'club_memberships'
  ) THEN
    RAISE NOTICE '102: skipping club_memberships policies — table missing';
    RETURN;
  END IF;

  DROP POLICY IF EXISTS "user_clubs_read_all" ON public.club_memberships;
  DROP POLICY IF EXISTS "memberships_read_all" ON public.club_memberships;
  DROP POLICY IF EXISTS "club_memberships_read_own" ON public.club_memberships;
  DROP POLICY IF EXISTS "club_memberships_read_club_owner" ON public.club_memberships;
  DROP POLICY IF EXISTS "club_memberships_read_admin" ON public.club_memberships;

  CREATE POLICY "club_memberships_read_own"
    ON public.club_memberships FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "club_memberships_read_admin"
    ON public.club_memberships FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
          AND role::text IN ('admin', 'founder')
      )
    );

  -- Owner policy only when clubs.slug + clubs.owner_id exist
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clubs' AND column_name = 'owner_id'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clubs' AND column_name = 'slug'
  ) THEN
    CREATE POLICY "club_memberships_read_club_owner"
      ON public.club_memberships FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM public.clubs
          WHERE clubs.slug = club_memberships.club_slug
            AND clubs.owner_id = auth.uid()
        )
      );
  ELSE
    RAISE NOTICE '102: skipping club_memberships_read_club_owner — clubs.owner_id or slug missing';
  END IF;
END $$;
