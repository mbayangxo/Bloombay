-- Auth hardening: lock down profile self-update to prevent privilege escalation
-- Schema-tolerant: only guards columns that exist on profiles (002+ early schemas OK)

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update own" ON public.profiles;

DO $$
DECLARE
  checks text := $policy$
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  $policy$;
  col text;
BEGIN
  -- Equality guard for non-null admin-controlled columns
  FOREACH col IN ARRAY ARRAY[
    'verification_status',
    'gov_id_verification_status',
    'bloom_points',
    'is_member'
  ] LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = col
    ) THEN
      checks := checks || format(
        ' AND %I = (SELECT %I FROM public.profiles WHERE id = auth.uid())',
        col, col
      );
    ELSE
      RAISE NOTICE '107: skipping profiles.% guard — column missing', col;
    END IF;
  END LOOP;

  -- Nullable membership fields
  FOREACH col IN ARRAY ARRAY['membership_type', 'membership_started_at'] LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = col
    ) THEN
      checks := checks || format(
        ' AND %I IS NOT DISTINCT FROM (SELECT %I FROM public.profiles WHERE id = auth.uid())',
        col, col
      );
    ELSE
      RAISE NOTICE '107: skipping profiles.% guard — column missing', col;
    END IF;
  END LOOP;

  EXECUTE format($sql$
    CREATE POLICY "profiles_update_own"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id)
      WITH CHECK (%s)
  $sql$, checks);

  RAISE NOTICE '107: profiles_update_own policy created';
END $$;
