-- BloomBay profiles + roles (run after 000_waitlist)

create type public.user_role as enum (
  'member',
  'founder',
  'admin',
  'club_owner',
  'partner',
  'moderator',
  'curator'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'member',
  city text,
  neighborhood text,
  verified boolean not null default false,
  host_level text default null,
  trust_score int default 0,
  attendance_score int default 0,
  community_score int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;

create policy "Profiles read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role / founder tools use service key

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  role_text text := nullif(trim(meta->>'role'), '');
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    city,
    neighborhood,
    role
  )
  values (
    new.id,
    coalesce(new.email, nullif(trim(meta->>'email'), '')),
    nullif(trim(meta->>'full_name'), ''),
    coalesce(nullif(trim(new.phone), ''), nullif(trim(meta->>'phone'), '')),
    nullif(trim(meta->>'city'), ''),
    nullif(trim(meta->>'neighborhood'), ''),
    case
      when role_text in (
        'member', 'founder', 'admin', 'club_owner', 'partner', 'moderator', 'curator'
      ) then role_text::public.user_role
      else 'member'::public.user_role
    end
  )
  on conflict (id) do update set
    email = coalesce(nullif(excluded.email, ''), profiles.email),
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
    city = coalesce(nullif(excluded.city, ''), profiles.city),
    neighborhood = coalesce(nullif(excluded.neighborhood, ''), profiles.neighborhood),
    role = coalesce(excluded.role, profiles.role),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
