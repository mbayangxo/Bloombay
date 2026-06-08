-- BloomBay 008: profiles phone + notification preferences + signup metadata trigger

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS sms_notifications boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true;

-- Copies signup fields from auth.users into public.profiles on every new user.
-- Trigger attachment: on_auth_user_created (created in 002_profiles_auth.sql).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  role_text text := nullif(trim(meta->>'role'), '');
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    city,
    neighborhood,
    role
  )
  VALUES (
    new.id,
    coalesce(new.email, nullif(trim(meta->>'email'), '')),
    nullif(trim(meta->>'full_name'), ''),
    coalesce(nullif(trim(new.phone), ''), nullif(trim(meta->>'phone'), '')),
    nullif(trim(meta->>'city'), ''),
    nullif(trim(meta->>'neighborhood'), ''),
    CASE
      WHEN role_text IN (
        'member', 'founder', 'admin', 'club_owner', 'partner', 'moderator', 'curator'
      ) THEN role_text::public.user_role
      ELSE 'member'::public.user_role
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = coalesce(nullif(excluded.email, ''), profiles.email),
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
    city = coalesce(nullif(excluded.city, ''), profiles.city),
    neighborhood = coalesce(nullif(excluded.neighborhood, ''), profiles.neighborhood),
    role = coalesce(excluded.role, profiles.role),
    updated_at = now();
  RETURN new;
END;
$$;
