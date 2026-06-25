-- Auth hardening: lock down profile self-update to prevent privilege escalation

-- Drop the broad update policy that allowed users to change any column on their own row
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;

-- Replacement: users can update their own profile but cannot change admin-controlled fields.
-- WITH CHECK subqueries verify that sensitive columns remain equal to their stored values.
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    -- Role cannot be self-elevated
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    -- Verification status is set only by service role / admin
    AND verification_status = (SELECT verification_status FROM public.profiles WHERE id = auth.uid())
    -- Gov ID verification status is set only by the verification service
    AND gov_id_verification_status = (SELECT gov_id_verification_status FROM public.profiles WHERE id = auth.uid())
    -- Bloom points are awarded only by the platform
    AND bloom_points = (SELECT bloom_points FROM public.profiles WHERE id = auth.uid())
    -- Membership flags are set only by admin approval flow
    AND is_member = (SELECT is_member FROM public.profiles WHERE id = auth.uid())
    AND membership_type IS NOT DISTINCT FROM (SELECT membership_type FROM public.profiles WHERE id = auth.uid())
    AND membership_started_at IS NOT DISTINCT FROM (SELECT membership_started_at FROM public.profiles WHERE id = auth.uid())
  );
