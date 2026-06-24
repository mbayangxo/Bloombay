-- Profile privacy hardening
-- Replace the open profiles_read_all policy with a restricted one.
-- Public consumers get a limited view; full profile data is self-only or admin.

-- Drop the old open policy if it exists
DROP POLICY IF EXISTS "profiles_read_all" ON profiles;
DROP POLICY IF EXISTS "public_profiles_read" ON profiles;

-- Users can always read their own full profile
CREATE POLICY "profiles_read_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins and founders can read all profiles
CREATE POLICY "profiles_read_admin"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'founder')
    )
  );

-- Members can read a safe subset of other members via a view (see below)
-- Direct table selects of other users' rows are blocked unless they are admin/founder.

-- ── Safe public profiles view ─────────────────────────────────────────────────
-- Exposes only non-sensitive fields for member discovery features.
CREATE OR REPLACE VIEW public_profiles AS
  SELECT
    id,
    first_name,
    full_name,
    avatar_url,
    city,
    is_member,
    neighborhood,
    role,
    created_at
  FROM profiles
  WHERE is_member = true;

-- Members can select from public_profiles view
GRANT SELECT ON public_profiles TO authenticated;

-- ── Club membership privacy ───────────────────────────────────────────────────
-- Drop over-permissive open club membership policy
DROP POLICY IF EXISTS "user_clubs_read_all" ON club_memberships;

-- Members see only their own club memberships
CREATE POLICY "club_memberships_read_own"
  ON club_memberships FOR SELECT
  USING (auth.uid() = user_id);

-- Club owners see their own club's members
CREATE POLICY "club_memberships_read_club_owner"
  ON club_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clubs
      WHERE clubs.slug = club_memberships.club_slug
      AND clubs.host_id = auth.uid()
    )
  );

-- Admins/founders see all memberships
CREATE POLICY "club_memberships_read_admin"
  ON club_memberships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'founder')
    )
  );
