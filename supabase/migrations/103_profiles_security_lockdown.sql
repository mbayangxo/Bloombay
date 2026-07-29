-- P0 security: lock privileged profile columns + stop anon reading all profiles
-- Audit: profiles_update_own allowed role escalation; profiles_read_all exposed everyone to anon.

-- ── 1) Prevent privilege escalation / points / Stripe tampering ─────────────
create or replace function public.protect_profiles_security_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_role text := coalesce(auth.jwt()->>'role', '');
  n jsonb := to_jsonb(new);
  o jsonb := to_jsonb(old);
begin
  -- Service role / dashboard SQL may change anything
  if jwt_role = 'service_role' then
    return new;
  end if;
  if current_user in ('postgres', 'supabase_admin', 'supabase_auth_admin') then
    return new;
  end if;

  -- Never allow clients to change these (json so missing columns are fine)
  if (n->>'role') is distinct from (o->>'role') then
    raise exception 'profiles.role is not client-writable';
  end if;

  if (n->>'bloom_points') is distinct from (o->>'bloom_points') then
    raise exception 'profiles.bloom_points is not client-writable';
  end if;

  if (n->>'bloom_code') is distinct from (o->>'bloom_code') then
    raise exception 'profiles.bloom_code is not client-writable';
  end if;

  if (n->>'member_number') is distinct from (o->>'member_number') then
    raise exception 'profiles.member_number is not client-writable';
  end if;

  if (n->>'email') is distinct from (o->>'email') then
    raise exception 'profiles.email is not client-writable';
  end if;

  if (n->>'is_member') is distinct from (o->>'is_member') then
    raise exception 'profiles.is_member is not client-writable';
  end if;

  if (n->>'membership_type') is distinct from (o->>'membership_type')
     or (n->>'membership_started_at') is distinct from (o->>'membership_started_at') then
    raise exception 'membership fields are not client-writable';
  end if;

  if (n->>'stripe_account_id') is distinct from (o->>'stripe_account_id')
     or (n->>'stripe_charges_enabled') is distinct from (o->>'stripe_charges_enabled')
     or (n->>'stripe_payouts_enabled') is distinct from (o->>'stripe_payouts_enabled')
     or (n->>'stripe_details_submitted') is distinct from (o->>'stripe_details_submitted') then
    raise exception 'Stripe Connect fields are not client-writable';
  end if;

  if (n->>'is_founding_mother') is distinct from (o->>'is_founding_mother') then
    raise exception 'profiles.is_founding_mother is not client-writable';
  end if;

  -- verification_status: members may only move unverified/rejected → pending
  if (n->>'verification_status') is distinct from (o->>'verification_status') then
    if not (
      coalesce(o->>'verification_status', 'unverified') in ('unverified', 'rejected')
      and (n->>'verification_status') = 'pending'
    ) then
      raise exception 'Cannot set verification_status to %', n->>'verification_status';
    end if;
  end if;

  -- onboarding_completed: only false → true
  if (n->>'onboarding_completed') is distinct from (o->>'onboarding_completed') then
    if not (
      coalesce(o->>'onboarding_completed', 'false') in ('false', 'f')
      and (n->>'onboarding_completed') in ('true', 't')
    ) then
      raise exception 'Cannot unset onboarding_completed';
    end if;
  end if;

  -- is_host: only false → true (become host)
  if (n->>'is_host') is distinct from (o->>'is_host') then
    if not (
      coalesce(o->>'is_host', 'false') in ('false', 'f')
      and (n->>'is_host') in ('true', 't')
    ) then
      raise exception 'Cannot change is_host that way';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profiles_security_columns on public.profiles;
create trigger protect_profiles_security_columns
  before update on public.profiles
  for each row execute function public.protect_profiles_security_columns();

-- Tighten UPDATE policy
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "Profiles update own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── 2) Stop anonymous open reads of every profile ───────────────────────────
drop policy if exists "profiles_read_all" on public.profiles;
drop policy if exists "Profiles read own" on public.profiles;

create policy "profiles_select_authenticated"
  on public.profiles
  for select
  to authenticated
  using (true);

-- ── 3) Public-safe directory view ───────────────────────────────────────────
create or replace view public.member_public_profiles
with (security_invoker = true)
as
select
  id,
  first_name,
  bio,
  avatar_url,
  city,
  borough,
  neighborhood,
  interests,
  era,
  created_at
from public.profiles;

grant select on public.member_public_profiles to authenticated;

-- ── 4) RPCs for intentional state changes ───────────────────────────────────
create or replace function public.activate_host_desk()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  update public.profiles
  set is_host = true
  where id = auth.uid();
  return true;
end;
$$;

revoke all on function public.activate_host_desk() from public;
grant execute on function public.activate_host_desk() to authenticated;

create or replace function public.request_verification()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  update public.profiles
  set verification_status = 'pending'
  where id = auth.uid()
    and verification_status in ('unverified', 'rejected');
  return true;
end;
$$;

revoke all on function public.request_verification() from public;
grant execute on function public.request_verification() to authenticated;

create or replace function public.complete_member_onboarding()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  update public.profiles
  set onboarding_completed = true
  where id = auth.uid()
    and onboarding_completed = false;
  return true;
end;
$$;

revoke all on function public.complete_member_onboarding() from public;
grant execute on function public.complete_member_onboarding() to authenticated;

comment on function public.protect_profiles_security_columns() is
  'P0: blocks client privilege escalation (role/admin/founder) and points/Stripe tampering';
